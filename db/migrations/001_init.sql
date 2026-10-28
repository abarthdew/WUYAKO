-- 우야꼬 초기 스키마 (표준 PostgreSQL, 호스트 무관)
-- 원칙
--   1. 원물(raw)만 저장한다. 합계·성공 여부·소요 시간 같은 계산값은 읽을 때 만든다.
--   2. 쓰기는 추가(append-only) 위주. 수정·현재 상태 플래그 대신 이력 행을 쌓는다.
--   3. 테이블 간 결합은 최소화. 콘텐츠 ↔ 이벤트는 FK 없이 키(문자열)로만 참조한다.

-- ── 콘텐츠 ─────────────────────────────────────────────
-- 관리자가 만드는 모든 콘텐츠(업종 테마, 미션, 메인 화면 구성, 학습 모듈 콘텐츠)의 정체성.
create table documents (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null check (kind in ('theme', 'mission', 'layout', 'lesson')),
  slug        text not null,
  created_at  timestamptz not null default now(),
  unique (kind, slug)
);

-- 저장할 때마다 한 행. 본문은 관리자가 입력한 그대로(JSON).
create table document_revisions (
  id           uuid primary key default gen_random_uuid(),
  document_id  uuid not null references documents (id),
  body         jsonb not null,
  author       text,
  created_at   timestamptz not null default now()
);
create index on document_revisions (document_id, created_at desc);

-- 게시 기록. "현재 게시본"은 저장하지 않고 가장 최근 행으로 계산한다.
create table document_publications (
  id            bigint generated always as identity primary key,
  document_id   uuid not null references documents (id),
  revision_id   uuid not null references document_revisions (id),
  published_by  text,
  published_at  timestamptz not null default now()
);
create index on document_publications (document_id, published_at desc);

-- 업로드 파일 메타데이터. 파일 자체는 스토리지(로컬 디스크/S3 등)에, URL은 읽을 때 조합.
create table assets (
  id             uuid primary key default gen_random_uuid(),
  storage_key    text not null unique,
  original_name  text,
  mime_type      text not null,
  byte_size      bigint not null,
  created_at     timestamptz not null default now()
);

-- ── 학습 기록 (익명) ─────────────────────────────────────
-- 브라우저 세션 1개 = 1행. 기기 정보는 파싱하지 않고 원문 그대로.
create table sessions (
  id           uuid primary key,             -- 클라이언트 생성
  user_agent   text,
  entry_url    text,                         -- UTM 등 쿼리 포함 원문
  referrer     text,
  language     text,
  viewport_w   integer,
  viewport_h   integer,
  received_at  timestamptz not null default now()
);

-- 사용자 행동 원물. payload는 이벤트 종류별 원본 데이터.
create table events (
  id           bigint generated always as identity primary key,
  session_id   uuid not null references sessions (id),
  seq          integer not null,             -- 세션 내 순번(클라이언트), 중복 전송 방지
  type         text not null,
  client_ts    timestamptz not null,         -- 기기 시각
  received_at  timestamptz not null default now(),
  payload      jsonb not null default '{}',
  unique (session_id, seq)
);
create index on events (type, client_ts);
