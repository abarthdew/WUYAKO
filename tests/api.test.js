// @vitest-environment node
// 실제 PostgreSQL(embedded, 임시 디렉터리)로 API 전체 경로를 확인한다.
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createLocalPostgres, localUrl } from '../server/db/localPostgres.js';

const PORT = 54391;
let pg;
let dir;
let app;

beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), 'wuyako-pg-'));
  pg = createLocalPostgres({ dir, port: PORT });
  await pg.initialise();
  await pg.start();
  await pg.createDatabase('wuyako_test');
  process.env.DATABASE_URL = localUrl(PORT, 'wuyako_test');
  const { migrate } = await import('../server/db/migrate.js');
  const { saveAndPublish } = await import('../server/repos/documents.js');
  const { createApp } = await import('../server/app.js');
  await migrate();
  await saveAndPublish({ kind: 'mission', slug: '1', body: { dine: 'in', items: [{ menuId: 'a', set: false, drinkId: null, qty: 1 }] } });
  app = createApp();
}, 120_000);

afterAll(async () => {
  const { closePool } = await import('../server/db/pool.js');
  await closePool();
  await pg?.stop();
  await rm(dir, { recursive: true, force: true });
});

const post = (path, body) =>
  app.request(`/api${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

describe('API + PostgreSQL', () => {
  it('마이그레이션은 두 번 실행해도 안전하다', async () => {
    const { migrate } = await import('../server/db/migrate.js');
    expect(await migrate()).toEqual([]);
  });

  it('게시본은 가장 최근 게시 기록을 따른다', async () => {
    const { saveAndPublish, listRevisions } = await import('../server/repos/documents.js');
    await saveAndPublish({ kind: 'mission', slug: '1', body: { dine: 'in', items: [{ menuId: 'b', set: false, drinkId: null, qty: 1 }] } });
    const res = await app.request('/api/content/mission/1');
    expect((await res.json()).body.items[0].menuId).toBe('b');
    expect(await listRevisions('mission', '1')).toHaveLength(2); // 이전 원본도 보존
  });

  it('이벤트는 원물 그대로 저장되고 지표는 읽을 때 계산된다', async () => {
    const sessionId = crypto.randomUUID();
    const t = Date.now();
    const cart = [{ menuId: 'b', set: false, drinkId: null, qty: 1 }];
    expect((await post('/track/sessions', { id: sessionId, userAgent: 'test' })).status).toBe(204);
    const events = [
      { seq: 1, type: 'stage_start', ts: t, payload: { stage: 1, missionKey: '1' } },
      { seq: 2, type: 'order_submit', ts: t + 30000, payload: { dine: 'in', cart } },
    ];
    expect((await post('/track/events', { sessionId, events })).status).toBe(204);
    expect((await post('/track/events', { sessionId, events })).status).toBe(204); // 재전송 무시

    const { fetchEvents } = await import('../server/repos/tracking.js');
    const stored = await fetchEvents();
    expect(stored).toHaveLength(2);
    expect(stored[1].payload.cart).toEqual(cart);

    const metrics = await (await app.request('/api/metrics/stages')).json();
    expect(metrics['1']).toMatchObject({ submits: 1, successes: 1, medianDurationMs: 30000 });
  });

  it('잘못된 요청은 400', async () => {
    expect((await post('/track/events', { sessionId: 'x', events: [] })).status).toBe(400);
    const sessionId = crypto.randomUUID();
    expect((await post('/track/events', { sessionId, events: [{ seq: 1, type: 't', ts: 1e18 }] })).status).toBe(400);
  });
});
