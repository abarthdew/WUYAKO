import EmbeddedPostgres from 'embedded-postgres';

// 개발용 로컬 PostgreSQL (Docker·sudo 없이). 운영 DB와는 무관.
export const createLocalPostgres = ({ dir = './.pgdata', port = 54329 } = {}) =>
  new EmbeddedPostgres({
    databaseDir: dir,
    user: 'wuyako',
    password: 'wuyako',
    port,
    persistent: true,
  });

export const localUrl = (port = 54329, db = 'wuyako') => `postgres://wuyako:wuyako@localhost:${port}/${db}`;
