import { Hono } from 'hono';
import { adminRoutes } from './routes/admin.js';
import { assetRoutes } from './routes/assets.js';
import { contentRoutes } from './routes/content.js';
import { metricsRoutes } from './routes/metrics.js';
import { trackingRoutes } from './routes/tracking.js';

// 라우트 조립만 담당. 실행 환경(Node 서버, 서버리스 등)과 분리해 이식성 유지.
export const createApp = () =>
  new Hono()
    .basePath('/api')
    .get('/health', (c) => c.json({ ok: true }))
    .route('/content', contentRoutes)
    .route('/track', trackingRoutes)
    .route('/metrics', metricsRoutes)
    .route('/admin', adminRoutes)
    .route('/assets', assetRoutes)
    .onError((err, c) => {
      console.error(err);
      return c.json({ error: 'internal' }, 500);
    });
