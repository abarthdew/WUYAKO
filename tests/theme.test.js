import { describe, expect, it } from 'vitest';
import fastfood from '../src/data/fastfood.json';
import { validateTheme } from '../src/features/theme/validateTheme.js';
import * as M from '../src/admin/theme/themeModel.js';

describe('테마 편집 모델', () => {
  it('기본 테마는 검사 통과', () => {
    expect(validateTheme(fastfood)).toEqual([]);
  });

  it('메뉴 추가·수정·삭제, 원본은 그대로', () => {
    const t1 = M.addItem(fastfood, 'side');
    const added = t1.menu.at(-1);
    expect(added.category).toBe('side');
    const t2 = M.updateItem(t1, added.id, { name: '어니언링', price: 2500 });
    expect(t2.menu.at(-1)).toMatchObject({ name: '어니언링', price: 2500 });
    expect(M.removeItem(t2, added.id).menu).toHaveLength(fastfood.menu.length);
    expect(fastfood.menu.some((m) => m.name === '어니언링')).toBe(false);
  });

  it('종류를 지우면 그 종류의 메뉴도 빠지고, 권유 메뉴를 지우면 권유도 빠진다', () => {
    const t = M.removeCategory(fastfood, 'dessert');
    expect(t.menu.some((m) => m.category === 'dessert')).toBe(false);
    expect(M.removeItem(fastfood, 'icecream').upsell).toBeNull();
  });

  it('검사: 음수 가격·없는 종류·빈 가게 이름', () => {
    const bad = M.updateItem(M.setStoreName(fastfood, ''), 'fries', { price: -1, category: 'none' });
    expect(validateTheme(bad).length).toBeGreaterThanOrEqual(3);
  });

  it('복사하면 새 id·가게 이름, 원본과 분리', () => {
    const c = M.copyTheme(fastfood, 'cafe', '우야꼬 카페');
    expect(c).toMatchObject({ id: 'cafe', storeName: '우야꼬 카페' });
    c.menu[0].name = 'x';
    expect(fastfood.menu[0].name).not.toBe('x');
  });
});
