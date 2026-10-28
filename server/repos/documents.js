import { getPool, withTransaction } from '../db/pool.js';

// 문서 저장소: 쓰기는 모두 추가(append). 수정·삭제 없음.

export const ensureDocument = async (kind, slug, db = getPool()) => {
  const { rows } = await db.query(
    `insert into documents (kind, slug) values ($1, $2)
     on conflict (kind, slug) do update set kind = excluded.kind
     returning id`,
    [kind, slug],
  );
  return rows[0].id;
};

export const addRevision = async ({ kind, slug, body, author = null }, db = getPool()) => {
  const documentId = await ensureDocument(kind, slug, db);
  const { rows } = await db.query(
    'insert into document_revisions (document_id, body, author) values ($1, $2, $3) returning id, created_at',
    [documentId, body, author],
  );
  return { documentId, revisionId: rows[0].id, createdAt: rows[0].created_at };
};

export const publishRevision = async ({ documentId, revisionId, publishedBy = null }, db = getPool()) => {
  await db.query(
    'insert into document_publications (document_id, revision_id, published_by) values ($1, $2, $3)',
    [documentId, revisionId, publishedBy],
  );
};

// 저장 + 게시를 한 번에 (시드·관리자 "바로 게시")
export const saveAndPublish = (input) =>
  withTransaction(async (db) => {
    const saved = await addRevision(input, db);
    await publishRevision({ ...saved, publishedBy: input.author }, db);
    return saved;
  });

export const findPublished = async (kind, slug) => {
  const { rows } = await getPool().query(
    `select r.id as revision_id, r.body, p.published_at
       from documents d
       join lateral (
         select revision_id, published_at from document_publications
          where document_id = d.id order by published_at desc, id desc limit 1
       ) p on true
       join document_revisions r on r.id = p.revision_id
      where d.kind = $1 and d.slug = $2`,
    [kind, slug],
  );
  return rows[0] ?? null;
};

export const listPublished = async (kind) => {
  const { rows } = await getPool().query(
    `select d.slug, r.id as revision_id, r.body, p.published_at
       from documents d
       join lateral (
         select revision_id, published_at from document_publications
          where document_id = d.id order by published_at desc, id desc limit 1
       ) p on true
       join document_revisions r on r.id = p.revision_id
      where d.kind = $1
      order by d.slug`,
    [kind],
  );
  return rows;
};

export const listRevisions = async (kind, slug) => {
  const { rows } = await getPool().query(
    `select r.id, r.author, r.created_at
       from document_revisions r join documents d on d.id = r.document_id
      where d.kind = $1 and d.slug = $2
      order by r.created_at desc`,
    [kind, slug],
  );
  return rows;
};

// 관리자용: 종류별 문서 목록 + 최신 리비전·게시 리비전
export const listDocuments = async (kind) => {
  const { rows } = await getPool().query(
    `select d.slug,
            (select id from document_revisions where document_id = d.id order by created_at desc limit 1) as latest_revision_id,
            (select revision_id from document_publications where document_id = d.id order by published_at desc, id desc limit 1) as published_revision_id,
            (select created_at from document_revisions where document_id = d.id order by created_at desc limit 1) as updated_at
       from documents d where d.kind = $1 order by d.slug`,
    [kind],
  );
  return rows;
};

// 관리자용: 최신 리비전(초안 포함) 본문
export const findLatest = async (kind, slug) => {
  const { rows } = await getPool().query(
    `select r.id as revision_id, r.body, r.created_at,
            (select revision_id from document_publications where document_id = d.id order by published_at desc, id desc limit 1) as published_revision_id
       from documents d join document_revisions r on r.document_id = d.id
      where d.kind = $1 and d.slug = $2
      order by r.created_at desc limit 1`,
    [kind, slug],
  );
  return rows[0] ?? null;
};

export const findRevision = async (kind, slug, revisionId) => {
  const { rows } = await getPool().query(
    `select r.id, r.document_id from document_revisions r join documents d on d.id = r.document_id
      where d.kind = $1 and d.slug = $2 and r.id = $3`,
    [kind, slug, revisionId],
  );
  return rows[0] ?? null;
};
