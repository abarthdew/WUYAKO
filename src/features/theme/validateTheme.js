// 테마 본문 검사 (서버 저장 전·관리자 화면 공용). 문제 목록을 돌려준다. 빈 배열 = 통과
export const validateTheme = (t) => {
  const errors = [];
  if (!t || typeof t !== 'object') return ['본문이 없습니다'];
  if (!t.storeName?.trim()) errors.push('가게 이름이 비었습니다');
  const cats = Array.isArray(t.categories) ? t.categories : [];
  if (!cats.length) errors.push('메뉴 종류(카테고리)가 하나 이상 필요합니다');
  const catIds = new Set();
  for (const c of cats) {
    if (!c.id?.trim() || !c.real?.trim()) errors.push('카테고리에 id와 이름이 필요합니다');
    if (catIds.has(c.id)) errors.push(`카테고리 id 중복: ${c.id}`);
    catIds.add(c.id);
  }
  const menu = Array.isArray(t.menu) ? t.menu : [];
  if (!menu.length) errors.push('메뉴가 하나 이상 필요합니다');
  const ids = new Set();
  for (const m of menu) {
    if (!m.id?.trim() || !m.name?.trim()) errors.push('메뉴에 id와 이름이 필요합니다');
    if (ids.has(m.id)) errors.push(`메뉴 id 중복: ${m.id}`);
    ids.add(m.id);
    if (!Number.isInteger(m.price) || m.price < 0) errors.push(`가격은 0 이상 정수여야 합니다: ${m.name}`);
    if (!catIds.has(m.category)) errors.push(`없는 카테고리를 쓰는 메뉴: ${m.name}`);
  }
  const so = t.setOption;
  if (menu.some((m) => m.options === 'set')) {
    if (!so || !Number.isInteger(so.extraPrice) || !Array.isArray(so.drinks) || !so.drinks.length) {
      errors.push('세트 메뉴가 있으면 세트 추가금과 음료 목록이 필요합니다');
    }
  }
  if (t.upsell?.menuId && !ids.has(t.upsell.menuId)) errors.push('추가 권유 메뉴가 메뉴 목록에 없습니다');
  return errors;
};
