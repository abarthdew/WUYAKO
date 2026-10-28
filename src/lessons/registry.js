import ButtonsLesson from './buttons/ButtonsLesson.jsx';
import ThreeStepsLesson from './threeSteps/ThreeStepsLesson.jsx';
import PictogramLesson from './pictogram/PictogramLesson.jsx';

// 구조 학습 모듈 등록부. contentSlug: 콘텐츠 문서(kind=lesson) slug
const LESSONS = [
  { id: 'buttons', title: '버튼 모양 익히기', summary: '이것만 알면 어떤 키오스크든', icon: '☰', contentSlug: 'buttons', component: ButtonsLesson },
  { id: 'three-steps', title: '3단계 원리', summary: '고르기 → 확인 → 결제', icon: '3', contentSlug: 'three-steps', component: ThreeStepsLesson },
  { id: 'pictogram', title: '비슷한 버튼 찾기', summary: '생김새가 달라도 뜻은 같아요', icon: '🔍', contentSlug: 'pictogram', component: PictogramLesson },
];

export const listLessons = () => LESSONS;
export const getLesson = (id) => LESSONS.find((l) => l.id === id) ?? null;
