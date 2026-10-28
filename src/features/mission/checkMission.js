import { lineKey } from '../cart/cart.js';

// 미션과 주문을 비교해 항목별 결과를 돌려준다.
export const checkMission = (mission, { cart, dine }) => {
  const want = new Map(mission.items.map((i) => [lineKey(i), i.qty]));
  const got = new Map(cart.map((l) => [lineKey(l), l.qty]));
  const keys = new Set([...want.keys(), ...got.keys()]);
  const items = [...keys].map((key) => ({
    key,
    want: want.get(key) ?? 0,
    got: got.get(key) ?? 0,
  }));
  const itemsOk = items.every((i) => i.want === i.got);
  const dineOk = mission.dine === dine;
  return { success: itemsOk && dineOk, dineOk, items };
};

export const isCartDone = (mission, cart) =>
  checkMission(mission, { cart, dine: mission.dine }).success;
