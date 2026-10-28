import pg from 'pg';

// 연결 정보는 DATABASE_URL 하나만 본다. 호스트(로컬·Supabase·RDS 등) 교체는 이 값만 바꾼다.
let pool;
export const getPool = () => {
  if (!pool) {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL이 없습니다 (.env 확인)');
    pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
};

export const closePool = async () => {
  await pool?.end();
  pool = undefined;
};

export const withTransaction = async (fn) => {
  const client = await getPool().connect();
  try {
    await client.query('begin');
    const result = await fn(client);
    await client.query('commit');
    return result;
  } catch (err) {
    await client.query('rollback');
    throw err;
  } finally {
    client.release();
  }
};
