import { describe, expect, it } from 'vitest';
import missions from '../src/data/missions.json';
import { checkMission } from '../src/features/mission/checkMission.js';
import { describeMistakes } from '../src/features/mission/describeMistakes.js';

const m = missions['fastfood-s3']; // 치킨버거 단품 2 + 감자튀김 1, 포장
const nameOf = (key) => key.split('|')[0];
const run = (cart, dine) => describeMistakes({ ...checkMission(m, { cart, dine }), dine }, m, nameOf).map((x) => x.text);

describe('틀린 곳 문장', () => {
  it('먹는 곳·빠진 것·개수·없는 것', () => {
    const texts = run(
      [
        { menuId: 'chicken', set: false, drinkId: null, qty: 1 },
        { menuId: 'cola', set: false, drinkId: null, qty: 1 },
      ],
      'in',
    );
    expect(texts).toContain("먹는 곳: '포장'인데 '매장 식사'를 골랐어요");
    expect(texts).toContain('개수가 달라요: chicken 2개인데 1개를 담았어요');
    expect(texts).toContain('빠졌어요: fries 1개');
    expect(texts).toContain('미션에 없어요: cola 1개를 담았어요');
  });
  it('다 맞으면 빈 목록', () => {
    expect(run(m.items, 'out')).toEqual([]);
  });
});
