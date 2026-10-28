// 대시보드 표시용 서식
export const pct = (r) => (r === null || r === undefined ? '–' : `${Math.round(r * 100)}%`);
export const num = (n) => (n ?? 0).toLocaleString('ko-KR');
export const dur = (ms) => {
  if (ms === null || ms === undefined) return '–';
  const s = Math.round(ms / 1000);
  return s < 60 ? `${s}초` : `${Math.floor(s / 60)}분 ${s % 60}초`;
};
export const MODE_LABEL = { follow: '따라서 해볼래요', help: '도움이 필요해요', undefined: '선택 없음' };
