// 장바구니 순수 함수. 상태를 바꾸지 않고 새 배열을 반환한다.
export const lineKey = ({ menuId, set, drinkId }) => `${menuId}|${set ? 1 : 0}|${drinkId ?? ''}`;

export const addLine = (cart, line) => {
  const key = lineKey(line);
  const found = cart.find((l) => lineKey(l) === key);
  if (found) return cart.map((l) => (lineKey(l) === key ? { ...l, qty: l.qty + line.qty } : l));
  return [...cart, { ...line }];
};

export const changeQty = (cart, key, delta) =>
  cart
    .map((l) => (lineKey(l) === key ? { ...l, qty: l.qty + delta } : l))
    .filter((l) => l.qty > 0);

export const removeLine = (cart, key) => cart.filter((l) => lineKey(l) !== key);

export const countItems = (cart) => cart.reduce((sum, l) => sum + l.qty, 0);

export const linePrice = (line, store) => {
  const menu = store.menu.find((m) => m.id === line.menuId);
  if (!menu) return 0;
  let unit = menu.price;
  if (line.set) {
    const drink = store.setOption.drinks.find((d) => d.id === line.drinkId);
    unit += store.setOption.extraPrice + (drink?.extraPrice ?? 0);
  }
  return unit * line.qty;
};

export const cartTotal = (cart, store) => cart.reduce((sum, l) => sum + linePrice(l, store), 0);

export const describeLine = (line, store) => {
  const menu = store.menu.find((m) => m.id === line.menuId);
  const drink = store.setOption.drinks.find((d) => d.id === line.drinkId);
  const base = menu?.name ?? line.menuId;
  return line.set ? `${base} 세트 (${drink?.name ?? '음료 미선택'})` : base;
};
