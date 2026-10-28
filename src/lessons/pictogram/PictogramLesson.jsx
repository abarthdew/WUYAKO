import { useState } from 'react';
import { track } from '../../features/analytics/analytics.js';
import LessonDone from '../LessonDone.jsx';
import LessonShell from '../LessonShell.jsx';
import Pictogram from './Pictogram.jsx';
import './PictogramLesson.css';

const sameSet = (a, b) => a.length === b.length && a.every((x) => b.includes(x));

// 구조 학습 ③: 모양이 다른 픽토그램 중 같은 뜻을 모두 고르기
export default function PictogramLesson({ lessonId, content, onExit }) {
  const { questions } = content;
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState([]);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0); // 화면 표시용. 저장은 원물(choices)만

  if (index >= questions.length) {
    return (
      <LessonShell title={content.title} step={questions.length} total={questions.length} onExit={onExit}>
        <LessonDone
          message={`${questions.length}문제 중 ${score}개 다 맞혔어요!`}
          onRetry={() => {
            track('lesson_start', { lessonId });
            setIndex(0);
            setPicked([]);
            setChecked(false);
            setScore(0);
          }}
          onExit={onExit}
        />
      </LessonShell>
    );
  }

  const q = questions[index];
  const allRight = checked && sameSet(picked, q.answers);
  const toggle = (id) => {
    if (checked) return;
    setPicked(picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id]);
  };
  const check = () => {
    setChecked(true);
    if (sameSet(picked, q.answers)) setScore(score + 1);
    track('lesson_answer', { lessonId, questionId: q.id, choices: picked });
  };
  const next = () => {
    if (index + 1 === questions.length) track('lesson_done', { lessonId });
    setIndex(index + 1);
    setPicked([]);
    setChecked(false);
  };

  const mark = (id) => {
    if (!checked) return picked.includes(id) ? 'is-picked' : '';
    const isAnswer = q.answers.includes(id);
    if (isAnswer) return picked.includes(id) ? 'is-right' : 'is-missed';
    return picked.includes(id) ? 'is-wrong' : '';
  };

  return (
    <LessonShell title={content.title} step={index} total={questions.length} onExit={onExit}>
      {index === 0 && <p className="picto-lesson__intro">{content.intro}</p>}
      <h2 className="picto-lesson__prompt">{q.prompt}</h2>
      <div className="picto-lesson__grid">
        {q.options.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={picked.includes(id)}
            className={`picto-lesson__option ${mark(id)}`}
            onClick={() => toggle(id)}
          >
            <Pictogram glyph={id} />
          </button>
        ))}
      </div>
      {checked && (
        <p className={`picto-lesson__feedback ${allRight ? 'is-ok' : ''}`} role="status">
          {allRight ? '모두 맞았어요! 👏 ' : '아쉬워요. 노란 테두리가 정답이에요. '}
          {q.explain}
        </p>
      )}
      {checked ? (
        <button type="button" className="picto-lesson__action" onClick={next}>
          {index + 1 === questions.length ? '결과 보기' : '다음 문제'}
        </button>
      ) : (
        <button type="button" className="picto-lesson__action" disabled={!picked.length} onClick={check}>
          다 골랐어요
        </button>
      )}
    </LessonShell>
  );
}
