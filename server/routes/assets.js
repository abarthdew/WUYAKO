import { Hono } from 'hono';
import { findAsset } from '../repos/assets.js';
import { getStorage } from '../storage/index.js';

const UUID = /^[0-9a-f-]{36}$/i;

// 업로드 파일 읽기 (공개)
export const assetRoutes = new Hono().get('/:id', async (c) => {
  const id = c.req.param('id');
  if (!UUID.test(id)) return c.json({ error: 'not_found' }, 404);
  const asset = await findAsset(id);
  const bytes = asset && (await getStorage().get(asset.storage_key));
  if (!bytes) return c.json({ error: 'not_found' }, 404);
  return c.body(bytes, 200, {
    'Content-Type': asset.mime_type,
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
  });
});
