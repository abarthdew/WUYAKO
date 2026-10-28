import ButtonsLesson from './buttons/ButtonsLesson.jsx';

// 구조 학습 모듈 등록부. contentSlug: 콘텐츠 문서(kind=lesson) slug
const LESSONS = [
  { id: 'buttons', title: '버튼 모양 익히기', summary: '이것만 알면 어떤 키오스크든', icon: '☰', contentSlug: 'buttons', component: ButtonsLesson },
];

export const listLessons = () => LESSONS;
export const getLesson = (id) => LESSONS.find((l) => l.id === id) ?? null;
