// 서버 수집 어댑터. 이벤트를 모아 묶음으로 보낸다. base 예: '/api'
const FLUSH_MS = 2000;
const MAX_BATCH = 20;

export const createHttpAdapter = (base) => {
  let queue = [];
  let timer = null;
  let sessionReady = Promise.resolve();

  const post = (path, body, { beacon = false } = {}) => {
    const json = JSON.stringify(body);
    if (beacon && navigator.sendBeacon?.(`${base}${path}`, new Blob([json], { type: 'application/json' }))) {
      return Promise.resolve();
    }
    return fetch(`${base}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
      keepalive: true,
    }).catch(() => {});
  };

  const flush = (opts) => {
    clearTimeout(timer);
    timer = null;
    if (!queue.length) return;
    const batch = queue;
    queue = [];
    const { sessionId } = batch[0];
    const events = batch.map(({ seq, type, ts, payload }) => ({ seq, type, ts, payload }));
    sessionReady.then(() => post('/track/events', { sessionId, events }, opts));
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('pagehide', () => flush({ beacon: true }));
  }

  return {
    startSession(context) {
      sessionReady = post('/track/sessions', context);
    },
    send(event) {
      queue.push(event);
      if (queue.length >= MAX_BATCH) flush();
      else timer ??= setTimeout(flush, FLUSH_MS);
    },
    flush,
  };
};
