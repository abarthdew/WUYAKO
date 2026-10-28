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

  it('관리자: 초안은 게시 전까지 공개 화면에 안 나오고, 게시하면 반영된다', async () => {
    const theme = { id: 't1', storeName: '가게A', categories: [{ id: 'c', easy: '', real: '종류' }], menu: [{ id: 'm', category: 'c', name: '메뉴', price: 1000, emoji: '🍔' }] };
    const save = (body, publish) =>
      app.request('/api/admin/documents/theme/t1', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ body, publish }) });
    expect((await save(theme, true)).status).toBe(200);
    const draft = await (await save({ ...theme, storeName: '가게B' }, false)).json();
    expect((await (await app.request('/api/content/theme/t1')).json()).body.storeName).toBe('가게A');
    const latest = await (await app.request('/api/admin/documents/theme/t1')).json();
    expect(latest.body.storeName).toBe('가게B');
    expect(latest.revisions).toHaveLength(2);
    await app.request('/api/admin/documents/theme/t1/publish', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ revisionId: draft.revisionId }) });
    expect((await (await app.request('/api/content/theme/t1')).json()).body.storeName).toBe('가게B');
    const bad = await save({ ...theme, menu: [{ ...theme.menu[0], price: -1 }] }, true);
    expect(bad.status).toBe(400);
    expect((await bad.json()).errors.length).toBeGreaterThan(0);
  });

  it('관리자: 이미지 업로드 → 공개 URL로 읽기, 허용 안 된 형식은 400', async () => {
    const { setStorage } = await import('../server/storage/index.js');
    const files = new Map();
    setStorage({ put: async (k, b) => files.set(k, b), get: async (k) => files.get(k) ?? null });
    const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);
    const form = new FormData();
    form.append('file', new File([png], 'a.png', { type: 'image/png' }));
    const res = await app.request('/api/admin/assets', { method: 'POST', body: form });
    expect(res.status).toBe(200);
    const { id } = await res.json();
    const got = await app.request(`/api/assets/${id}`);
    expect(got.headers.get('content-type')).toBe('image/png');
    expect(new Uint8Array(await got.arrayBuffer())).toEqual(png);

    const svg = new FormData();
    svg.append('file', new File(['<svg/>'], 'x.svg', { type: 'image/svg+xml' }));
    expect((await app.request('/api/admin/assets', { method: 'POST', body: svg })).status).toBe(400);
  });

  it('ADMIN_TOKEN이 있으면 관리자 API는 토큰 필요', async () => {
    process.env.ADMIN_TOKEN = 'secret';
    try {
      expect((await app.request('/api/admin/session')).status).toBe(401);
      expect((await app.request('/api/admin/session', { headers: { authorization: 'Bearer secret' } })).status).toBe(200);
    } finally {
      delete process.env.ADMIN_TOKEN;
    }
  });

  it('잘못된 요청은 400', async () => {
    expect((await post('/track/events', { sessionId: 'x', events: [] })).status).toBe(400);
    const sessionId = crypto.randomUUID();
    expect((await post('/track/events', { sessionId, events: [{ seq: 1, type: 't', ts: 1e18 }] })).status).toBe(400);
  });
});
