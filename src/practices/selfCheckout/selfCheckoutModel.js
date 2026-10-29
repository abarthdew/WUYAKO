// 셀프 계산대(D. 스캔·계산형): 시작 → 물건 찍기 → 봉투 → 결제 → 영수증. 순수 함수만.
export const init = () => ({ screen: 'idle', scanned: [], bag: null, pay: null });

export const countIn = (scanned, id) => scanned.filter((x) => x === id).length;

export const reduce = (s, a) => {
  switch (a.type) {
    case 'START': return { ...s, screen: 'scan' };
    case 'SCAN': return { ...s, scanned: [...s.scanned, a.id] };
    case 'REMOVE': {
      const i = s.scanned.lastIndexOf(a.id);
      return i < 0 ? s : { ...s, scanned: s.scanned.filter((_, j) => j !== i) };
    }
    case 'TO_BAG': return s.scanned.length ? { ...s, screen: 'bag' } : s;
    case 'BAG': return { ...s, bag: a.count, screen: 'pay' };
    case 'BACK': return { ...s, screen: { bag: 'scan', pay: 'bag' }[s.screen] ?? s.screen };
    case 'PAY': return { ...s, pay: a.method, screen: 'receipt' };
    case 'RECEIPT': return { ...s, screen: 'finished' };
    default: return s;
  }
};

// 바구니와 찍은 목록 차이
const diff = (s, basket) => ({
  dup: basket.find((b) => countIn(s.scanned, b.id) > 1)?.id ?? null,
  missing: basket.find((b) => !countIn(s.scanned, b.id))?.id ?? null,
});

export const isFinished = (s) => s.screen === 'finished';

export const targetOf = (s, m, c) => {
  if (s.screen === 'idle') return 'sc-start';
  if (s.screen === 'scan') {
    const { dup, missing } = diff(s, c.basket);
    if (dup) return `sc-remove-${dup}`;
    return missing ? `sc-scan-${missing}` : 'sc-next';
  }
  if (s.screen === 'bag') return diff(s, c.basket).missing ? 'sc-back' : `sc-bag-${m.bag}`;
  if (s.screen === 'pay') return s.bag !== m.bag ? 'sc-back' : `sc-pay-${m.pay}`;
  if (s.screen === 'receipt') return 'sc-receipt-no';
  return null;
};

export const resultOf = (s, m, c) => {
  const { dup, missing } = diff(s, c.basket);
  const mistakes = [];
  if (missing) mistakes.push('안 찍은 물건이 있어요');
  if (dup) mistakes.push('같은 물건을 두 번 찍었어요');
  if (s.bag !== m.bag) mistakes.push('봉투 선택이 미션과 달라요');
  if (s.pay !== m.pay) mistakes.push('결제 방법이 미션과 달라요');
  return { success: !mistakes.length, mistakes };
};

export const rawOf = (s) => ({ scanned: s.scanned, bag: s.bag, pay: s.pay });

export const totalOf = (s, content) =>
  s.scanned.reduce((sum, id) => sum + (content.basket.find((b) => b.id === id)?.price ?? 0), 0) + (s.bag ?? 0) * content.bagPrice;
