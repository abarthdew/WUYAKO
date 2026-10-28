import { isDeepStrictEqual } from 'node:util';
import { readdir, readFile } from 'node:fs/promises';
import { closePool } from '../server/db/pool.js';
import { migrate } from '../server/db/migrate.js';
import { findPublished, saveAndPublish } from '../server/repos/documents.js';

// 번들 JSON → 문서로 저장·게시. 게시본과 같으면 건너뛴다 (이력 중복 방지).
const load = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));

// data/{dir}/*.json → kind 문서들
const loadDir = async (dir, kind) =>
  Promise.all(
    (await readdir(new URL(`../src/data/${dir}/`, import.meta.url))).map(async (f) => ({
      kind,
      slug: f.replace(/\.json$/, ''),
      body: await load(`../src/data/${dir}/${f}`),
    })),
  );

const seeds = [
  { kind: 'theme', slug: 'fastfood', body: await load('../src/data/fastfood.json') },
  ...Object.entries(await load('../src/data/missions.json')).map(([slug, body]) => ({ kind: 'mission', slug, body })),
  ...(await loadDir('lessons', 'lesson')),
  ...(await loadDir('layouts', 'layout')),
];

await migrate();
for (const s of seeds) {
  const current = await findPublished(s.kind, s.slug);
  if (current && isDeepStrictEqual(current.body, s.body)) {
    console.log(`skip  ${s.kind}/${s.slug}`);
    continue;
  }
  await saveAndPublish({ ...s, author: 'seed' });
  console.log(`saved ${s.kind}/${s.slug}`);
}
await closePool();
