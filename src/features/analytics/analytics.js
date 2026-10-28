import { localAdapter } from './adapters/localAdapter.js';

// 저장소 교체 지점. 서버가 생기면 어댑터만 바꾼다 (예: httpAdapter → Cloudflare D1).
let adapter = localAdapter;
export const setAnalyticsAdapter = (next) => {
  adapter = next;
};

const sessionId = (() => {
  try {
    return crypto.randomUUID();
  } catch {
    return String(Date.now());
  }
})();

// 개인정보 없이 익명 이벤트만 기록한다.
export const track = (type, payload = {}) =>
  adapter.send({ type, sessionId, ts: Date.now(), ...payload });
