// 영화 예매(B. 예매형): 날짜·상영 고르기 → 인원 → 좌석 → 결제 → 표. 순수 함수만.
export const init = () => ({ screen: 'when', date: 'd0', showId: null, people: 1, seats: [], pay: null });

const BACK = { people: 'when', seat: 'people', pay: 'seat' };

export const reduce = (s, a) => {
  switch (a.type) {
    case 'SET_DATE': return { ...s, date: a.id, showId: null };
    case 'PICK_SHOW': return { ...s, showId: a.id, screen: 'people' };
    case 'PLUS': return { ...s, people: Math.min(s.people + 1, 8), seats: [] };
    case 'MINUS': return { ...s, people: Math.max(s.people - 1, 1), seats: [] };
    case 'TO_SEAT': return { ...s, screen: 'seat' };
    case 'TOGGLE_SEAT': {
      if (s.seats.includes(a.id)) return { ...s, seats: s.seats.filter((x) => x !== a.id) };
      return s.seats.length < s.people ? { ...s, seats: [...s.seats, a.id] } : s;
    }
    case 'TO_PAY': return s.seats.length === s.people ? { ...s, screen: 'pay' } : s;
    case 'PAY': return { ...s, pay: a.method, screen: 'ticket' };
    case 'BACK': return { ...s, screen: BACK[s.screen] ?? s.screen };
    case 'FINISH': return { ...s, screen: 'finished' };
    default: return s;
  }
};

export const targetOf = (s, m) => {
  if (s.screen === 'when') return s.date !== m.date ? `mv-date-${m.date}` : `mv-show-${m.showId}`;
  if (s.screen === 'people') {
    if (s.showId !== m.showId) return 'mv-back';
    return s.people < m.people ? 'mv-plus' : s.people > m.people ? 'mv-minus' : 'mv-next';
  }
  if (s.screen === 'seat') {
    if (s.people !== m.people) return 'mv-back';
    const extra = s.seats.find((x) => !m.seats.includes(x));
    if (extra) return `mv-seat-${extra}`;
    const missing = m.seats.find((x) => !s.seats.includes(x));
    return missing ? `mv-seat-${missing}` : 'mv-next';
  }
  if (s.screen === 'pay') return `mv-pay-${m.pay}`;
  if (s.screen === 'ticket') return 'mv-finish';
  return null;
};

export const isFinished = (s) => s.screen === 'finished';

export const resultOf = (s, m) => {
  const mistakes = [];
  if (s.date !== m.date || s.showId !== m.showId) mistakes.push('날짜나 상영 시간이 미션과 달라요');
  if (s.people !== m.people) mistakes.push(`인원을 ${s.people}명으로 했어요 (미션: ${m.people}명)`);
  if (s.pay !== m.pay) mistakes.push('결제 방법이 미션과 달라요');
  return { success: !mistakes.length, mistakes };
};

export const rawOf = (s) => ({ date: s.date, showId: s.showId, people: s.people, seats: s.seats, pay: s.pay });
