import { getStage } from '../features/stage/stages.js';
import { getVersion } from '../kiosk/versions/registry.js';
import { getLesson } from '../lessons/registry.js';

// 메인 화면 칸 종류 등록부. resolve: 칸 → 표시 정보(없는 참조면 null → 숨김)
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
      return { kind: 'card', icon: String(stage.id), title: s.title || stage.title, summary: s.summary || stage.summary, path: `/kiosk/${v.id}?theme=${s.theme}` };
    },
  },
};

export const resolveSlot = (slot) => (slot.visible === false ? null : SLOT_TYPES[slot.type]?.resolve(slot) ?? null);
