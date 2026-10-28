import { localAdapter } from './adapters/localAdapter.js';
import { createHttpAdapter } from './adapters/httpAdapter.js';

// 원물 이벤트만 기록한다. 성공 여부·소요 시간 같은 계산은 읽는 쪽(server/read)에서 한다.
// 저장소 교체 지점: VITE_API_BASE가 있으면 서버, 없으면 브라우저에만 저장.
const apiBase = import.meta.env?.VITE_API_BASE;
let adapter = apiBase ? createHttpAdapter(apiBase) : localAdapter;
export const setAnalyticsAdapter = (next) => {
  adapter = next;
};

const sessionId = (() => {
  try {
    return crypto.randomUUID();
  } catch {
    return '00000000-0000-4000-8000-' + String(Date.now()).padStart(12, '0').slice(-12);
  }
})();
let seq = 0;
let sessionSent = false;

// 개인정보 없는 기기 원문 정보 (파싱하지 않음)
const sessionContext = () => ({
  id: sessionId,
  userAgent: navigator.userAgent,
  entryUrl: location.href,
  referrer: document.referrer || null,
  language: navigator.language,
  viewportW: window.innerWidth,
  viewportH: window.innerHeight,
});

export const track = (type, payload = {}) => {
  if (!sessionSent) {
    sessionSent = true;
    adapter.startSession?.(sessionContext());
  }
  seq += 1;
  adapter.send({ sessionId, seq, type, ts: Date.now(), payload });
};
