import { createLocalDisk } from './localDisk.js';

// 파일 저장소 선택 지점. STORAGE_DRIVER로 교체 (현재 local만)
let storage;
export const getStorage = () => {
  storage ??= createLocalDisk(process.env.UPLOAD_DIR ?? './uploads');
  return storage;
};
export const setStorage = (s) => {
  storage = s;
};
