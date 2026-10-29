import { frameQuery } from '../features/frame/frame.js';
import { getStage } from '../features/stage/stages.js';
import { getVersion } from '../kiosk/versions/registry.js';
import { getLesson } from '../lessons/registry.js';
import { getPractice } from '../practices/registry.js';

// 메인 화면 칸 종류 등록부. resolve: 칸 → 표시 정보(없는 참조면 null → 숨김)
// 키오스크·짧은 연습 칸은 외곽(device·skin)을 주소에 실어 보낸다.
const withFrame = (path, slot) => {
  const q = frameQuery(slot);
  return q ? `${path}${path.includes('?') ? '&' : '?'}${q}` : path;
};
export const SLOT_TYPES = {
  heading: {
    label: '제목',
    resolve: (s) => ({ kind: 'heading', text: s.text }),
  },
  lesson: {
    label: '원리 배우기',
    resolve: (s) => {
      const l = getLesson(s.ref);
      return l && { kind: 'card', icon: l.icon, title: s.title || l.title, summary: s.summary || l.summary, path: `/lesson/${l.id}` };
    },
  },
  kiosk: {
    label: '키오스크 연습',
    resolve: (s) => {
      const v = getVersion(s.ref);
      if (!v) return null;
      const stage = getStage(v.stage);
      return { kind: 'card', icon: String(stage.id), title: s.title || stage.title, summary: s.summary || stage.summary, path: withFrame(`/kiosk/${v.id}?theme=${s.theme}`, s) };
    },
  },
  practice: {
    label: '짧은 연습',
    resolve: (s) => {
      const p = getPractice(s.ref);
      return p && { kind: 'card', icon: p.icon, title: s.title || p.title, summary: s.summary || p.summary, path: withFrame(`/practice/${p.id}`, p.fixedDevice ? { skin: s.skin } : s) };
    },
  },
};

export const resolveSlot = (slot) => (slot.visible === false ? null : SLOT_TYPES[slot.type]?.resolve(slot) ?? null);
