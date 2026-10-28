// 테마 편집 순수 함수. 모두 새 객체를 돌려준다.
const slugify = (s, taken) => {
  const base = s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';
  let id = base;
  for (let n = 2; taken.has(id); n += 1) id = `${base}-${n}`;
  return id;
};

export const setStoreName = (t, storeName) => ({ ...t, storeName });

export const addCategory = (t) => {
  const id = slugify('cat', new Set(t.categories.map((c) => c.id)));
  return { ...t, categories: [...t.categories, { id, easy: '', real: '새 종류' }] };
};
export const updateCategory = (t, id, patch) => ({
  ...t,
  categories: t.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
});
export const removeCategory = (t, id) => ({
  ...t,
  categories: t.categories.filter((c) => c.id !== id),
  menu: t.menu.filter((m) => m.category !== id),
});

export const addItem = (t, category) => {
  const id = slugify('item', new Set(t.menu.map((m) => m.id)));
  return { ...t, menu: [...t.menu, { id, category: category ?? t.categories[0]?.id, name: '새 메뉴', price: 0, emoji: '🍽️' }] };
};
export const updateItem = (t, id, patch) => ({
  ...t,
  menu: t.menu.map((m) => (m.id === id ? { ...m, ...patch } : m)),
});
export const removeItem = (t, id) => ({
  ...t,
  menu: t.menu.filter((m) => m.id !== id),
  upsell: t.upsell?.menuId === id ? null : t.upsell,
});

export const updateSetOption = (t, patch) => ({ ...t, setOption: { ...t.setOption, ...patch } });
export const updateDrink = (t, id, patch) =>
  updateSetOption(t, { drinks: t.setOption.drinks.map((d) => (d.id === id ? { ...d, ...patch } : d)) });

// 기존 테마를 복사해 새 테마 초안을 만든다 (이미지·메뉴 구성 재사용)
export const copyTheme = (t, slug, storeName) => ({ ...structuredClone(t), id: slug, storeName });
