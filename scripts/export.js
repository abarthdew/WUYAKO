import { mkdir, writeFile } from 'node:fs/promises';
import { closePool, getPool } from '../server/db/pool.js';

// 테이블별 NDJSON 내보내기 (pg_dump가 없는 환경용, 사람이 읽을 수 있는 원물 보관)
const TABLES = ['documents', 'document_revisions', 'document_publications', 'assets', 'sessions', 'events'];
const dir = `backups/${new Date().toISOString().replace(/[:.]/g, '-')}`;
await mkdir(dir, { recursive: true });
for (const t of TABLES) {
  const { rows } = await getPool().query(`select * from ${t} order by 1`);
  await writeFile(`${dir}/${t}.ndjson`, rows.map((r) => JSON.stringify(r)).join('\n'));
  console.log(`${t}: ${rows.length}`);
}
console.log(`→ ${dir}`);
await closePool();
