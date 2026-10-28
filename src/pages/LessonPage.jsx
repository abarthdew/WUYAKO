import { useEffect } from 'react';
import { navigate } from '../app/router.js';
import { track } from '../features/analytics/analytics.js';
import Notice from '../components/Notice.jsx';
import { useDocument } from '../content/useDocument.js';
import { getLesson } from '../lessons/registry.js';

// #/lesson/:id → 모듈 + 콘텐츠 문서(kind=lesson)를 모아 렌더링
export default function LessonPage({ lessonId }) {
  const lesson = getLesson(lessonId);
  const content = useDocument('lesson', lesson?.contentSlug ?? null);
  useEffect(() => {
    if (lesson) track('lesson_start', { lessonId: lesson.id });
  }, [lesson]);
  if (!lesson) return <Notice text="없는 화면이에요." onHome={() => navigate('/')} />;
  if (content.status === 'loading') return <Notice text="불러오는 중…" />;
  if (!content.data) return <Notice text="학습 내용을 찾을 수 없어요." onHome={() => navigate('/')} />;
  const Lesson = lesson.component;
  return <Lesson key={lesson.id} lessonId={lesson.id} content={content.data} onExit={() => navigate('/')} />;
}
