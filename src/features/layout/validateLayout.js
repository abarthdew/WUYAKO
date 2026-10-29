import { isDevice, isSkin } from '../frame/frame.js';

// 메인 화면 구성 검사 (서버·관리자 화면 공용). known이 있으면 참조 대상까지 확인한다.
export const SLOT_TYPES = ['heading', 'lesson', 'kiosk', 'practice'];

export const validateLayout = (layout, known = null) => {
  const errors = [];
  if (!layout || !Array.isArray(layout.slots)) return ['slots 목록이 필요합니다'];
  if (!layout.title?.trim()) errors.push('메인 제목이 비었습니다');
  const ids = new Set();
  layout.slots.forEach((s, i) => {
    const at = `${i + 1}번 칸`;
    if (!s.id || ids.has(s.id)) errors.push(`${at}: id가 없거나 중복입니다`);
    ids.add(s.id);
    if (!SLOT_TYPES.includes(s.type)) errors.push(`${at}: 알 수 없는 종류 ${s.type}`);
    if (s.type === 'heading' && !s.text?.trim()) errors.push(`${at}: 제목 글자가 비었습니다`);
    if (s.type === 'lesson' && known && !known.lessons.includes(s.ref)) errors.push(`${at}: 없는 학습 ${s.ref}`);
    if (s.device && !isDevice(s.device)) errors.push(`${at}: 알 수 없는 기기 형태 ${s.device}`);
    if (s.skin && !isSkin(s.skin)) errors.push(`${at}: 알 수 없는 스킨 ${s.skin}`);
    if (s.type === 'practice' && known?.practices && !known.practices.includes(s.ref)) errors.push(`${at}: 없는 연습 ${s.ref}`);
    if (s.type === 'kiosk') {
      if (known && !known.versions.includes(s.ref)) errors.push(`${at}: 없는 화면 버전 ${s.ref}`);
      if (!s.theme) errors.push(`${at}: 가게(테마)를 고르세요`);
      else if (known?.themes && !known.themes.includes(s.theme)) errors.push(`${at}: 게시되지 않은 테마 ${s.theme}`);
    }
  });
  return errors;
};
