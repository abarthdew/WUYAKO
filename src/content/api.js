import { FALLBACK } from './fallback.js';

// 게시 콘텐츠 읽기. 서버가 없거나 실패하면 번들 콘텐츠로 대체한다.
const base = import.meta.env?.VITE_API_BASE;

const fromFallback = (kind, slug) => FALLBACK[kind]?.[slug] ?? null;

export const fetchPublished = async (kind, slug) => {
  if (base) {
    try {
      const res = await fetch(`${base}/content/${kind}/${encodeURIComponent(slug)}`);
      if (res.ok) return (await res.json()).body;
      if (res.status === 404) return fromFallback(kind, slug);
    } catch {
      // 서버 없음 → 번들
    }
  }
  return fromFallback(kind, slug);
};

export const listPublished = async (kind) => {
  if (base) {
    try {
      const res = await fetch(`${base}/content/${kind}`);
      if (res.ok) return (await res.json()).map((d) => ({ slug: d.slug, body: d.body }));
    } catch {
      // 서버 없음 → 번들
    }
  }
  return Object.entries(FALLBACK[kind] ?? {}).map(([slug, body]) => ({ slug, body }));
};
