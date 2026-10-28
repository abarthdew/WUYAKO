// 원물 이벤트 → 공유 버튼 위치·방법별 클릭 수
export const shareMetrics = (events) => {
  const counts = new Map();
  for (const e of events) {
    if (e.type !== 'share_click') continue;
    const key = `${e.payload.place}|${e.payload.method}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts]
    .map(([key, count]) => {
      const [place, method] = key.split('|');
      return { place, method, count };
    })
    .sort((a, b) => b.count - a.count);
};
