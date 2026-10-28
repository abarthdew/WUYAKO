import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { withTransaction } from './pool.js';

const DIR = fileURLToPath(new URL('../../db/migrations/', import.meta.url));

// db/migrations/*.sql을 이름 순서로 한 번씩 적용한다.
export const migrate = async () =>
  withTransaction(async (db) => {
    await db.query(`create table if not exists schema_migrations (
      name text primary key, applied_at timestamptz not null default now())`);
    const done = new Set((await db.query('select name from schema_migrations')).rows.map((r) => r.name));
    const files = (await readdir(DIR)).filter((f) => f.endsWith('.sql')).sort();
    const applied = [];
    for (const name of files.filter((f) => !done.has(f))) {
      await db.query(await readFile(DIR + name, 'utf8'));
      await db.query('insert into schema_migrations (name) values ($1)', [name]);
      applied.push(name);
    }
    return applied;
  });
