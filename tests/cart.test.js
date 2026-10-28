import { describe, expect, it } from 'vitest';
import store from '../src/data/fastfood.json';
import { addLine, cartTotal, changeQty, countItems, lineKey } from '../src/features/cart/cart.js';

const setLine = { menuId: 'bulgogi', set: true, drinkId: 'orange', qty: 1 };

describe('cart', () => {
  it('같은 구성은 수량을 합친다', () => {
    const cart = addLine(addLine([], setLine), setLine);
    expect(cart).toHaveLength(1);
    expect(countItems(cart)).toBe(2);
  });
  it('세트·음료 추가금을 계산한다', () => {
    expect(cartTotal([setLine], store)).toBe(4500 + 2500 + 500);
  });
  it('수량 0이면 줄을 지운다', () => {
    expect(changeQty([setLine], lineKey(setLine), -1)).toEqual([]);
  });
});
