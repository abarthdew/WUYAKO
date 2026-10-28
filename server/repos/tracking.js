import { getPool, withTransaction } from '../db/pool.js';

// 학습 기록 저장소: 받은 그대로 넣는다.

export const upsertSession = async (s, db = getPool()) => {
  await db.query(
    `insert into sessions (id, user_agent, entry_url, referrer, language, viewport_w, viewport_h)
     values ($1, $2, $3, $4, $5, $6, $7)
     on conflict (id) do nothing`,
    [s.id, s.userAgent ?? null, s.entryUrl ?? null, s.referrer ?? null, s.language ?? null, s.viewportW ?? null, s.viewportH ?? null],
  );
};

export const insertEvents = (sessionId, events) =>
  withTransaction(async (db) => {
    for (const e of events) {
      await db.query(
        `insert into events (session_id, seq, type, client_ts, payload)
         values ($1, $2, $3, to_timestamp($4 / 1000.0), $5)
         on conflict (session_id, seq) do nothing`,
        [sessionId, e.seq, e.type, e.ts, e.payload ?? {}],
      );
    }
    return events.length;
  });

export const fetchEvents = async ({ types, since } = {}) => {
  const { rows } = await getPool().query(
    `select session_id, seq, type, client_ts, payload from events
      where ($1::text[] is null or type = any($1)) and ($2::timestamptz is null or client_ts >= $2)
      order by session_id, seq`,
    [types ?? null, since ?? null],
  );
  return rows;
};

export const fetchSessions = async ({ since } = {}) => {
  const { rows } = await getPool().query(
    'select id, entry_url, received_at from sessions where ($1::timestamptz is null or received_at >= $1) order by received_at',
    [since ?? null],
  );
  return rows;
};
