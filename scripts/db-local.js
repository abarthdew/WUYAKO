import { createLocalPostgres, localUrl } from '../server/db/localPostgres.js';
import { existsSync } from 'node:fs';

// 로컬 개발 DB 실행: npm run db:local (Ctrl+C로 종료)
const pg = createLocalPostgres();
if (!existsSync('./.pgdata/PG_VERSION')) await pg.initialise();
await pg.start();
try {
  await pg.createDatabase('wuyako');
} catch {
  // 이미 있음
}
console.log(`PostgreSQL 실행 중: ${localUrl()}`);

const stop = async () => {
  await pg.stop();
  process.exit(0);
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
