// 단계별 기본 설정. 화면 버전(kiosk/versions)이 이 값을 바탕으로 덮어쓸 수 있다.
//   guide: 'hand'(손가락+음영) | 'shade'(음영·윤곽만) | 'none'
//   termMode: 'easy'(쉬운 말 크게) | 'both'(실제 용어 크게+쉬운 말 작게) | 'real'
export const STAGES = {
  1: {
    id: 1,
    title: '1단계 · 따라 하기',
    summary: '큰 글씨, 손가락이 알려 줘요',
    guide: 'hand',
    termMode: 'easy',
    menuLayout: 'top',
    upsell: false,
    timeLimitSec: null,
  },
  2: {
    id: 2,
    title: '2단계 · 살짝 도움 받기',
    summary: '진짜 이름에 익숙해져요',
    guide: 'shade',
    termMode: 'both',
    menuLayout: 'top',
    upsell: false,
    timeLimitSec: null,
  },
  3: {
    id: 3,
    title: '3단계 · 혼자 하기',
    summary: '진짜 가게처럼, 도움 없이',
    guide: 'none',
    termMode: 'real',
    menuLayout: 'side',
    upsell: true,
    timeLimitSec: 180, // 표시만, 실패 처리 없음
  },
};

export const getStage = (id) => STAGES[id] ?? STAGES[1];
