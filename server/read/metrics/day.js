// 날짜 묶음은 한국 시간 기준 (YYYY-MM-DD)
const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' });
export const dayKey = (d) => fmt.format(new Date(d));

// from~to 사이 모든 날짜 (빈 날도 0으로 채우기 위함)
export const dayRange = (from, to) => {
  const days = [];
  for (let t = new Date(from).getTime(); dayKey(t) <= dayKey(to); t += 86_400_000) days.push(dayKey(t));
  return [...new Set(days)];
};
