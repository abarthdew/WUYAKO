import { Hono } from 'hono';
import { fetchEvents, fetchSessions } from '../repos/tracking.js';
import { listPublished } from '../repos/documents.js';
import { dayKey } from '../read/metrics/day.js';
import { overview } from '../read/overview.js';
import { stageMetrics } from '../read/stageMetrics.js';
import { requireAdmin } from './requireAdmin.js';

const DAY = 86_400_000;
const bySlug = (docs) => Object.fromEntries(docs.map((d) => [d.slug, d.body]));

// 지표 조회 (관리자). 원물 이벤트를 읽어 그 자리에서 계산한다.
export const metricsRoutes = new Hono()
  .use(requireAdmin)
  .get('/stages', async (c) => {
    const [events, missions] = await Promise.all([
      fetchEvents({ types: ['stage_start', 'tap', 'order_submit'], since: c.req.query('since') }),
      listPublished('mission'),
    ]);
    return c.json(stageMetrics(events, bySlug(missions)));
  })
  // days: 7 | 30 | all
  .get('/overview', async (c) => {
    const days = c.req.query('days') ?? '7';
    const to = new Date();
    // 한국 시간 기준 그날 0시부터
    const since = days === 'all' ? null : `${dayKey(to.getTime() - (Number(days) - 1) * DAY)}T00:00:00+09:00`;
    const [sessions, events, missions, lessons] = await Promise.all([
      fetchSessions({ since }),
      fetchEvents({ since }),
      listPublished('mission'),
      listPublished('lesson'),
    ]);
    const from = since ?? sessions[0]?.received_at ?? to;
    return c.json(overview({ sessions, events, missions: bySlug(missions), lessons: bySlug(lessons), from, to }));
  });
