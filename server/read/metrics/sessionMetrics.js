import { dayKey, dayRange } from './day.js';

// 세션 원물 → 일별 방문 수
export const dailySessions = (sessions, from, to) => {
  const counts = new Map(dayRange(from, to).map((d) => [d, 0]));
  for (const s of sessions) {
    const k = dayKey(s.received_at);
    if (counts.has(k)) counts.set(k, counts.get(k) + 1);
  }
  return [...counts].map(([day, count]) => ({ day, count }));
};

// 세션 원물(entry_url) → 유입 경로별 수. UTM이 없으면 '직접 방문'
export const trafficSources = (sessions) => {
  const counts = new Map();
  for (const s of sessions) {
    let source = '직접 방문';
    let campaign = '';
    try {
      const q = new URL(s.entry_url).searchParams;
      source = q.get('utm_source') || source;
      campaign = q.get('utm_campaign') || '';
    } catch {
      // 주소 없음·잘못된 주소 → 직접 방문
    }
    const key = `${source}|${campaign}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts]
    .map(([key, count]) => {
      const [source, campaign] = key.split('|');
      return { source, campaign, count };
    })
    .sort((a, b) => b.count - a.count);
};
