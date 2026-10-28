// 서버 수집용 어댑터. endpoint 예: '/api/events' (Cloudflare Pages Functions + D1)
export const createHttpAdapter = (endpoint) => ({
  send(event) {
    const body = JSON.stringify(event);
    if (navigator.sendBeacon?.(endpoint, body)) return;
    fetch(endpoint, { method: 'POST', body, keepalive: true }).catch(() => {});
  },
});
