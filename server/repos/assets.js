import { getPool } from '../db/pool.js';

// 파일 메타데이터만 다룬다. 실제 업로드·스토리지 어댑터는 관리자 모드(ABTHDW-54)에서 추가.
export const insertAsset = async ({ storageKey, originalName, mimeType, byteSize }) => {
  const { rows } = await getPool().query(
    `insert into assets (storage_key, original_name, mime_type, byte_size)
     values ($1, $2, $3, $4) returning id`,
    [storageKey, originalName ?? null, mimeType, byteSize],
  );
  return rows[0].id;
};
