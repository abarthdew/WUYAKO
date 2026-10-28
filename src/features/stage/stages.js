// 단계별 설정. 화면은 이 값만 보고 분기한다.
export const STAGES = {
  1: {
    id: 1,
    title: '1단계 · 따라 하기',
    guide: true, // 손가락 + 음영
    termMode: 'easy', // 쉬운 말 크게, 실제 용어 작게
    menuLayout: 'top', // 카테고리 탭 위치
    upsell: false,
    timeLimitSec: null,
  },
  3: {
    id: 3,
    title: '3단계 · 혼자 하기',
    guide: false,
    termMode: 'real',
    menuLayout: 'side',
    upsell: true, // 추가 메뉴 권유 팝업
    timeLimitSec: 180, // 표시만, 실패 처리 없음
  },
};

export const getStage = (id) => STAGES[id] ?? STAGES[1];
