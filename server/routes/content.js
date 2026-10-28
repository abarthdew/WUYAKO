import { Hono } from 'hono';
import { findPublished, listPublished } from '../repos/documents.js';

// 게시된 콘텐츠 읽기 (공개)
export const contentRoutes = new Hono()
  .get('/:kind', async (c) => c.json(await listPublished(c.req.param('kind'))))
  .get('/:kind/:slug', async (c) => {
    const doc = await findPublished(c.req.param('kind'), c.req.param('slug'));
    return doc ? c.json(doc) : c.json({ error: 'not_found' }, 404);
  });
