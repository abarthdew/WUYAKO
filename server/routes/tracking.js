import { Hono } from 'hono';
import { insertEvents, upsertSession } from '../repos/tracking.js';

const UUID = /^[0-9a-f-]{36}$/i;
const MAX_BATCH = 100;
const TS_MIN = Date.UTC(2020, 0, 1);
const TS_MAX = Date.UTC(2100, 0, 1);

const isEvent = (e) =>
  e && Number.isInteger(e.seq) && typeof e.type === 'string' && e.type.length <= 64 && Number.isFinite(e.ts) && e.ts > TS_MIN && e.ts < TS_MAX;

// 익명 학습 기록 쓰기 (공개, 쓰기 전용)
export const trackingRoutes = new Hono()
  .post('/sessions', async (c) => {
    const body = await c.req.json();
    if (!UUID.test(body?.id ?? '')) return c.json({ error: 'bad_session' }, 400);
    await upsertSession(body);
    return c.body(null, 204);
  })
  .post('/events', async (c) => {
    const { sessionId, events } = await c.req.json();
    if (!UUID.test(sessionId ?? '') || !Array.isArray(events) || events.length > MAX_BATCH || !events.every(isEvent)) {
      return c.json({ error: 'bad_events' }, 400);
    }
    await upsertSession({ id: sessionId });
    await insertEvents(sessionId, events);
    return c.body(null, 204);
  });
