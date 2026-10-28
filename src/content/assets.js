// 업로드 파일 URL은 저장하지 않고 id로 조합한다
const base = import.meta.env?.VITE_API_BASE || '/api';
export const assetUrl = (id) => (id ? `${base}/assets/${id}` : null);
