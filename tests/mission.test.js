import { describe, expect, it } from 'vitest';
import store from '../src/data/fastfood.json';
import missions from '../src/data/missions.json';
import { checkMission } from '../src/features/mission/checkMission.js';
import { guideTarget } from '../src/features/guide/guideTarget.js';
import { initialState } from '../src/app/sessionReducer.js';

const m1 = missions['1'];

describe('checkMission', () => {
  it('미션과 같으면 성공', () => {
    expect(checkMission(m1, { cart: m1.items, dine: 'in' }).success).toBe(true);
  });
  it('음료가 다르면 실패', () => {
    const cart = [{ ...m1.items[0], drinkId: 'cola' }];
    expect(checkMission(m1, { cart, dine: 'in' }).success).toBe(false);
  });
  it('먹는 곳이 다르면 실패', () => {
    const r = checkMission(m1, { cart: m1.items, dine: 'out' });
    expect(r.success).toBe(false);
    expect(r.dineOk).toBe(false);
  });
});

describe('guideTarget (1단계)', () => {
  const at = (patch) => guideTarget({ ...initialState, ...patch }, m1, store);
  it('흐름 순서대로 하나만 가리킨다', () => {
    expect(at({ screen: 'idle' })).toBe('idle-touch');
    expect(at({ screen: 'dine' })).toBe('dine-in');
    expect(at({ screen: 'menu', category: 'drink' })).toBe('cat-burger');
    expect(at({ screen: 'menu' })).toBe('menu-bulgogi');
    expect(at({ screen: 'menu', option: { menuId: 'bulgogi', set: null } })).toBe('opt-set');
    expect(at({ screen: 'menu', option: { menuId: 'bulgogi', set: true, drinkId: null } })).toBe('drink-cider');
    expect(at({ screen: 'menu', option: { menuId: 'bulgogi', set: true, drinkId: 'cider' } })).toBe('opt-add');
    expect(at({ screen: 'menu', cart: m1.items })).toBe('cart-go');
    expect(at({ screen: 'payment' })).toBe('pay-card');
    expect(at({ screen: 'payment', payMethod: 'card' })).toBe('pay-insert');
  });
});
