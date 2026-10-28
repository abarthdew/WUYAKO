import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// 로컬 디스크 저장소 (개발용). 같은 모양으로 S3·Supabase Storage 어댑터를 만들어 교체한다.
export const createLocalDisk = (dir) => ({
  async put(key, bytes) {
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, key), bytes);
  },
  async get(key) {
    try {
      return await readFile(join(dir, key));
    } catch {
      return null;
    }
  },
});
