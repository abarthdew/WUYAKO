# 우야꼬 (WUYAKO)

> 키오스크 외우지 마세요, 읽는 법을 배우세요.

노년층이 처음 보는 키오스크도 스스로 다룰 수 있도록 화면의 구조와 원리를 가르치는 학습 웹 서비스.

- Epic: [ABTHDW-46](https://sugar-coat-code.atlassian.net/browse/ABTHDW-46)
- 2019 시안: [abarthdew/wuyako-for-semi](https://github.com/abarthdew/wuyako-for-semi)

## 실행

```bash
npm install
cp .env.example .env
npm run db:local    # 터미널 1: 로컬 PostgreSQL (Docker·sudo 불필요, ./.pgdata)
npm run db:seed     # 번들 JSON → DB 문서로 저장·게시 (마이그레이션 포함)
npm run dev:api     # 터미널 2: API 서버 :8787
npm run dev         # 터미널 3: 프론트 (/api는 8787로 프록시)
npm test            # 단위·흐름·DB 통합 테스트
npm run build       # dist/ 정적 빌드
```

| 명령 | 용도 |
| --- | --- |
| `npm run db:migrate` | `db/migrations/*.sql` 적용 |
| `npm run db:export` | 테이블별 NDJSON 내보내기 → `backups/` |
| `npm run db:dump` | `pg_dump` 백업 (pg_dump 설치 환경) |

## 데이터 원칙

- PostgreSQL 표준 SQL만 사용. 연결은 `DATABASE_URL` 하나 → 호스트(로컬·Supabase·RDS 등) 교체 시 이 값만 변경.
- 원물만 저장하고 계산은 읽을 때(`server/read/`). 예: 성공 여부·소요 시간은 저장하지 않음.
- 쓰기는 추가(append-only). 콘텐츠는 리비전·게시 기록을 쌓고, "현재 게시본"은 조회로 계산.

## 구조

```
src/
  app/          App(라우팅), 해시 라우터, StageContext
  pages/        라우트별 페이지 (콘텐츠를 불러와 하위 모듈에 주입)
  kiosk/        주문 흐름 실행기(KioskRunner), 세션 reducer
    versions/   화면 버전 등록부(registry.js) — stage{n}-v{m}
  content/      게시 콘텐츠 읽기(API, 실패 시 번들 대체)
  screens/      화면 단위 (Home, Mission, Idle, Dine, Menu, Cart, Payment, Done + 팝업)
  components/   공용 UI (KioskButton, Term, Badge, Popup, KioskFrame ...)
  features/
    stage/      단계 기본 설정(stages.js) — 1·2·3단계 차이
    guide/      가이드 대상 계산(guideTarget.js), 손가락 애니메이션
    mission/    미션 카드, 정답 비교(checkMission.js)
    cart/       장바구니 순수 함수
    analytics/  이벤트 기록 — 어댑터 교체로 저장소 변경
    speech/     음성 안내 (Web Speech API)
  data/         업종 데이터(fastfood.json), 미션(missions.json)
  styles/       디자인 토큰, 기본 스타일
server/
  db/           연결(pool), 마이그레이션 실행, 로컬 PostgreSQL
  repos/        테이블 접근 (SQL만)
  read/         읽을 때 가공 (지표 계산)
  routes/       API 라우트 (content / track / metrics)
  app.js        라우트 조립 (실행 환경과 분리)
db/migrations/  스키마 SQL
scripts/        로컬 DB, 시드, 내보내기
tests/          vitest (순수 함수 + jsdom 흐름 + DB 통합)
```

## 규칙

- 컴포넌트마다 `.jsx` + `.css` 분리, import로 연결.
- 로직은 순수 함수(`features/*/*.js`)로 분리하고 화면은 표시만 담당.
- 업종 확장: 테마 문서(kind=theme) + 미션 문서(slug `{테마}-s{단계}`). 화면 코드는 재사용.
- 화면 버전 추가: `kiosk/versions/`에 screens 묶음을 만들고 registry에 등록.
