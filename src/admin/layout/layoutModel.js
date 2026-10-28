// 메인 화면 구성 편집 순수 함수. 모두 새 객체를 돌려준다.
const newId = (slots, prefix) => {
  const taken = new Set(slots.map((s) => s.id));
  let n = slots.length + 1;
  while (taken.has(`${prefix}${n}`)) n += 1;
  return `${prefix}${n}`;
};

const DEFAULTS = {
  heading: () => ({ type: 'heading', text: '새 제목' }),
  lesson: (ctx) => ({ type: 'lesson', ref: ctx.lessons[0] }),
  kiosk: (ctx) => ({ type: 'kiosk', ref: ctx.versions[0], theme: ctx.themes[0] }),
};

export const addSlot = (layout, type, ctx) => ({
  ...layout,
  slots: [...layout.slots, { id: newId(layout.slots, type[0]), visible: true, ...DEFAULTS[type](ctx) }],
});

export const updateSlot = (layout, id, patch) => ({
  ...layout,
  slots: layout.slots.map((s) => (s.id === id ? { ...s, ...patch } : s)),
});

export const removeSlot = (layout, id) => ({ ...layout, slots: layout.slots.filter((s) => s.id !== id) });

export const moveSlot = (layout, id, delta) => {
  const i = layout.slots.findIndex((s) => s.id === id);
  const j = i + delta;
  if (i < 0 || j < 0 || j >= layout.slots.length) return layout;
  const slots = [...layout.slots];
  [slots[i], slots[j]] = [slots[j], slots[i]];
  return { ...layout, slots };
};

export const setHeader = (layout, patch) => ({ ...layout, ...patch });
