// 음식점 대기 등록: 시작 → 인원 → 연락처(010 뒤 8자리) → 확인 → 대기번호. 순수 함수만.
export const PHONE_LEN = 8;

export const init = () => ({ screen: 'idle', people: 1, phone: '' });

export const reduce = (s, a) => {
  switch (a.type) {
    case 'START': return { ...s, screen: 'people' };
    case 'PLUS': return { ...s, people: Math.min(s.people + 1, 10) };
    case 'MINUS': return { ...s, people: Math.max(s.people - 1, 1) };
    case 'TO_PHONE': return { ...s, screen: 'phone' };
    case 'KEY': return s.phone.length < PHONE_LEN ? { ...s, phone: s.phone + a.digit } : s;
    case 'DEL': return { ...s, phone: s.phone.slice(0, -1) };
    case 'TO_CHECK': return s.phone.length === PHONE_LEN ? { ...s, screen: 'check' } : s;
    case 'BACK': return { ...s, screen: { phone: 'people', check: 'phone' }[s.screen] ?? s.screen };
    case 'SUBMIT': return { ...s, screen: 'ticket' };
    case 'FINISH': return { ...s, screen: 'finished' };
    default: return s;
  }
};

// 지금 누를 버튼 id (가이드용)
export const targetOf = (s, m) => {
  if (s.screen === 'idle') return 'wl-start';
  if (s.screen === 'people') return s.people < m.people ? 'wl-plus' : s.people > m.people ? 'wl-minus' : 'wl-next';
  if (s.screen === 'phone') {
    if (!m.phone.startsWith(s.phone)) return 'wl-del';
    return s.phone === m.phone ? 'wl-next' : `wl-key-${m.phone[s.phone.length]}`;
  }
  if (s.screen === 'check') return s.people === m.people && s.phone === m.phone ? 'wl-submit' : 'wl-back';
  if (s.screen === 'ticket') return 'wl-finish';
  return null;
};

export const isFinished = (s) => s.screen === 'finished';

export const resultOf = (s, m) => {
  const mistakes = [];
  if (s.people !== m.people) mistakes.push(`인원을 ${s.people}명으로 했어요 (미션: ${m.people}명)`);
  if (s.phone !== m.phone) mistakes.push('전화번호가 미션과 달라요');
  return { success: !mistakes.length, mistakes };
};

// 기록용 원물
export const rawOf = (s) => ({ people: s.people, phoneLen: s.phone.length });

export const formatPhone = (d) => `010-${d.slice(0, 4)}${d.length > 4 ? '-' : ''}${d.slice(4)}`;
