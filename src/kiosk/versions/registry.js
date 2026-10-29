import { getStage } from '../../features/stage/stages.js';
import { v1Screens } from './v1Screens.js';

// 키오스크 화면 버전 등록부. id 규칙: stage{단계}-v{번호}
// 흐름(상태·미션·장바구니)은 공통이고, 여기서는 모양(screens)과 설정(overrides)만 다르다.
// flowType: 연습 유형(features/flowType), device: 기기 형태
const VERSIONS = [
  { id: 'stage1-v1', stage: 1, flowType: 'A', device: 'kiosk', label: '기본형', screens: v1Screens },
  { id: 'stage2-v1', stage: 2, flowType: 'A', device: 'kiosk', label: '기본형', screens: v1Screens },
  { id: 'stage3-v1', stage: 3, flowType: 'A', device: 'kiosk', label: '기본형', screens: v1Screens },
];

export const listVersions = () => VERSIONS;

export const getVersion = (id) => {
  const v = VERSIONS.find((x) => x.id === id);
  if (!v) return null;
  return { ...v, config: { ...getStage(v.stage), ...v.overrides } };
};

// 다음 단계의 첫 버전 (없으면 null)
export const nextStageVersion = (id) => {
  const v = VERSIONS.find((x) => x.id === id);
  return VERSIONS.find((x) => x.stage === v?.stage + 1)?.id ?? null;
};
