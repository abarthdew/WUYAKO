import { randomUUID } from 'node:crypto';
import { Hono } from 'hono';
import { insertAsset } from '../repos/assets.js';
import { addRevision, findLatest, findRevision, listDocuments, listRevisions, publishRevision } from '../repos/documents.js';
import { getStorage } from '../storage/index.js';
import { KINDS, SLUG, validateBody } from '../validate/content.js';
import { requireAdmin } from './requireAdmin.js';

const MAX_UPLOAD = 5 * 1024 * 1024;
const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' };

const checkTarget = (c) => {
  const { kind, slug } = c.req.param();
  if (!KINDS.includes(kind)) return c.json({ error: 'bad_kind' }, 400);
  if (slug !== undefined && !SLUG.test(slug)) return c.json({ error: 'bad_slug' }, 400);
  return null;
};

// 관리자 API: 콘텐츠 저장·게시, 파일 업로드
export const adminRoutes = new Hono()
  .use(requireAdmin)
  .get('/session', (c) => c.json({ ok: true }))
  .get('/documents/:kind', async (c) => checkTarget(c) ?? c.json(await listDocuments(c.req.param('kind'))))
  .get('/documents/:kind/:slug', async (c) => {
    const bad = checkTarget(c);
    if (bad) return bad;
    const { kind, slug } = c.req.param();
    const latest = await findLatest(kind, slug);
    if (!latest) return c.json({ error: 'not_found' }, 404);
    return c.json({ ...latest, revisions: await listRevisions(kind, slug) });
  })
  .post('/documents/:kind/:slug', async (c) => {
    const bad = checkTarget(c);
    if (bad) return bad;
    const { kind, slug } = c.req.param();
    const { body, publish = false } = await c.req.json();
    const errors = validateBody(kind, body);
    if (errors.length) return c.json({ error: 'invalid', errors }, 400);
    const saved = await addRevision({ kind, slug, body, author: 'admin' });
    if (publish) await publishRevision({ ...saved, publishedBy: 'admin' });
    return c.json({ revisionId: saved.revisionId, published: publish });
  })
  .post('/documents/:kind/:slug/publish', async (c) => {
    const bad = checkTarget(c);
    if (bad) return bad;
    const { kind, slug } = c.req.param();
    const { revisionId } = await c.req.json();
    const rev = await findRevision(kind, slug, revisionId);
    if (!rev) return c.json({ error: 'not_found' }, 404);
    await publishRevision({ documentId: rev.document_id, revisionId: rev.id, publishedBy: 'admin' });
    return c.json({ revisionId: rev.id, published: true });
  })
  .post('/assets', async (c) => {
    const form = await c.req.parseBody();
    const file = form.file;
    if (!(file instanceof File)) return c.json({ error: 'no_file' }, 400);
    const ext = EXT[file.type];
    if (!ext) return c.json({ error: 'bad_type' }, 400);
    if (file.size > MAX_UPLOAD) return c.json({ error: 'too_large' }, 400);
    const key = `${randomUUID()}.${ext}`;
    await getStorage().put(key, Buffer.from(await file.arrayBuffer()));
    const id = await insertAsset({ storageKey: key, originalName: file.name, mimeType: file.type, byteSize: file.size });
    return c.json({ id });
  });
