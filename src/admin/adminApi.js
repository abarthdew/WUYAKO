// 관리자 API 호출. 토큰은 탭을 닫으면 사라지도록 sessionStorage에만 둔다.
const base = import.meta.env?.VITE_API_BASE || '/api';
const KEY = 'wuyako.adminToken';

export const getToken = () => {
  try {
    return sessionStorage.getItem(KEY) ?? '';
  } catch {
    return '';
  }
};
export const setToken = (t) => {
  try {
    if (t) sessionStorage.setItem(KEY, t);
    else sessionStorage.removeItem(KEY);
  } catch {
    // 저장 불가 시 무시
  }
};

const request = async (path, init = {}) => {
  const res = await fetch(`${base}/admin${path}`, {
    ...init,
    headers: { ...(init.headers ?? {}), Authorization: `Bearer ${getToken()}` },
  });
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw Object.assign(new Error(data?.error ?? `HTTP ${res.status}`), { status: res.status, data });
  return data;
};

const json = (method, body) => ({ method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

export const adminApi = {
  checkSession: () => request('/session'),
  listDocuments: (kind) => request(`/documents/${kind}`),
  getDocument: (kind, slug) => request(`/documents/${kind}/${slug}`),
  saveDocument: (kind, slug, body, publish) => request(`/documents/${kind}/${slug}`, json('POST', { body, publish })),
  publishRevision: (kind, slug, revisionId) => request(`/documents/${kind}/${slug}/publish`, json('POST', { revisionId })),
  uploadAsset: (file) => {
    const form = new FormData();
    form.append('file', file);
    return request('/assets', { method: 'POST', body: form });
  },
};
