import { Hono } from 'hono';
import { fetchEvents } from '../repos/tracking.js';
import { listPublished } from '../repos/documents.js';
import { stageMetrics } from '../read/stageMetrics.js';
import { requireAdmin } from './requireAdmin.js';

// 지표 조회 (관리자). 원물 이벤트를 읽어 그 자리에서 계산한다.
export const metricsRoutes = new Hono().use(requireAdmin).get('/stages', async (c) => {
  const [events, missions] = await Promise.all([
    fetchEvents({ types: ['stage_start', 'tap', 'order_submit'], since: c.req.query('since') }),
    listPublished('mission'),
  ]);
  const missionMap = Object.fromEntries(missions.map((m) => [m.slug, m.body]));
  return c.json(stageMetrics(events, missionMap));
});
