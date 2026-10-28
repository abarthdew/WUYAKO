import { lineKey } from '../cart/cart.js';

// 1단계 가이드: 지금 눌러야 할 요소 id 하나만 반환한다.
const nextNeededItem = (mission, cart) =>
  mission.items.find((want) => {
    const got = cart.find((l) => lineKey(l) === lineKey(want));
    return (got?.qty ?? 0) < want.qty;
  });

export const guideTarget = (state, mission, store) => {
  const { screen, cart, option, category, payMethod } = state;
  switch (screen) {
    case 'idle':
      return 'idle-touch';
    case 'dine':
      return `dine-${mission.dine}`;
    case 'menu': {
      const need = nextNeededItem(mission, cart);
      if (option) {
        if (option.set === null) return need?.set ? 'opt-set' : 'opt-single';
        if (option.set && !option.drinkId) return `drink-${need?.drinkId ?? 'cola'}`;
        return 'opt-add';
      }
      if (!need) return 'cart-go';
      const menu = store.menu.find((m) => m.id === need.menuId);
      return menu.category === category ? `menu-${menu.id}` : `cat-${menu.category}`;
    }
    case 'cart':
      return 'cart-pay';
    case 'payment':
      return payMethod ? 'pay-insert' : 'pay-card';
    default:
      return null;
  }
};
