// 테이블 QR 주문: 휴대폰 카메라 → QR 링크 열기 → 메뉴 담기 → 장바구니 → 주문 확인. 결제 없음.
export const init = () => ({ screen: 'home', cart: {}, confirm: false });

const setQty = (cart, id, qty) => {
  const next = { ...cart };
  if (qty > 0) next[id] = qty;
  else delete next[id];
  return next;
};

export const reduce = (s, a) => {
  switch (a.type) {
    case 'OPEN_CAMERA': return { ...s, screen: 'camera' };
    case 'OPEN_LINK': return { ...s, screen: 'menu' };
    case 'ADD': return { ...s, cart: setQty(s.cart, a.id, (s.cart[a.id] ?? 0) + 1) };
    case 'REMOVE': return { ...s, cart: setQty(s.cart, a.id, (s.cart[a.id] ?? 0) - 1) };
    case 'OPEN_CART': return { ...s, screen: 'cart' };
    case 'BACK_TO_MENU': return { ...s, screen: 'menu', confirm: false };
    case 'ORDER': return Object.keys(s.cart).length ? { ...s, confirm: true } : s;
    case 'CONFIRM_NO': return { ...s, confirm: false };
    case 'CONFIRM_YES': return { ...s, screen: 'ordered', confirm: false };
    case 'FINISH': return { ...s, screen: 'finished' };
    default: return s;
  }
};

const wanted = (m) => Object.fromEntries(m.items.map((i) => [i.menuId, i.qty]));

// 미션과 장바구니 차이: missing(더 담을 것), extra(뺄 것)
const diff = (cart, m) => {
  const w = wanted(m);
  const missing = Object.keys(w).find((id) => (cart[id] ?? 0) < w[id]) ?? null;
  const extra = Object.keys(cart).find((id) => cart[id] > (w[id] ?? 0)) ?? null;
  return { missing, extra };
};

export const targetOf = (s, m) => {
  const { missing, extra } = diff(s.cart, m);
  if (s.screen === 'home') return 'qr-camera';
  if (s.screen === 'camera') return 'qr-link';
  if (s.screen === 'menu') return missing && !extra ? `qr-add-${missing}` : 'qr-open-cart';
  if (s.screen === 'cart') {
    if (s.confirm) return missing || extra ? 'qr-no' : 'qr-yes';
    if (extra) return `qr-minus-${extra}`;
    return missing ? 'qr-back' : 'qr-order';
  }
  if (s.screen === 'ordered') return 'qr-finish';
  return null;
};

export const isFinished = (s) => s.screen === 'finished';

export const resultOf = (s, m) => {
  const { missing, extra } = diff(s.cart, m);
  const mistakes = [];
  if (missing) mistakes.push('미션 메뉴를 다 담지 않았어요');
  if (extra) mistakes.push('미션에 없는 메뉴가 들어갔어요');
  return { success: !mistakes.length, mistakes };
};

export const rawOf = (s) => ({ cart: s.cart });

export const countOf = (cart) => Object.values(cart).reduce((a, b) => a + b, 0);
export const totalOf = (cart, menu) => menu.reduce((sum, x) => sum + (cart[x.id] ?? 0) * x.price, 0);
