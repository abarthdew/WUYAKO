import { serve } from '@hono/node-server';
import { createApp } from './app.js';
import { migrate } from './db/migrate.js';

const port = Number(process.env.PORT ?? 8787);
const applied = await migrate();
if (applied.length) console.log('migrations applied:', applied.join(', '));
serve({ fetch: createApp().fetch, port }, () => console.log(`api: http://localhost:${port}/api/health`));
