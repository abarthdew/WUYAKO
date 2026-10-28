import { useState } from 'react';
import SpeakButton from '../../components/SpeakButton.jsx';
import { track } from '../../features/analytics/analytics.js';
import LessonDone from '../LessonDone.jsx';
import LessonShell from '../LessonShell.jsx';
import MiniScreen from './MiniScreen.jsx';
import './ThreeStepsLesson.css';

// 구조 학습 ②: 3단계 설명 → 여러 업종 화면에서 몇 번째 단계인지 맞히기
export default function ThreeStepsLesson({ lessonId, content, onExit }) {
  const { steps, quiz } = content;
  const total = steps.length + quiz.length;
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState(null);
  const [score, setScore] = useState(0); // 화면 표시용. 저장은 원물(choice)만

  const restart = () => {
    track('lesson_start', { lessonId });
    setIndex(0);
    setChoice(null);
    setScore(0);
  };
  const next = () => {
    setChoice(null);
    setIndex(index + 1);
    if (index + 1 === total) track('lesson_done', { lessonId });
  };

  if (index >= total) {
    return (
      <LessonShell title={content.title} step={total} total={total} onExit={onExit}>
        <ol className="steps-row">
          {steps.map((s) => (
            <li key={s.id}>{s.icon} {s.name}</li>
          ))}
        </ol>
        <LessonDone message={`${quiz.length}문제 중 ${score}개 맞혔어요!`} onRetry={restart} onExit={onExit} />
      </LessonShell>
    );
  }

  // 설명 단계
  if (index < steps.length) {
    const s = steps[index];
    return (
      <LessonShell title={content.title} step={index} total={total} onExit={onExit}>
        {index === 0 && <p className="steps__intro">{content.intro}</p>}
        <ol className="steps-row" aria-label="3단계">
          {steps.map((x) => (
            <li key={x.id} className={x.id === s.id ? 'is-now' : ''}>{x.no}. {x.name}</li>
          ))}
        </ol>
        <section className="steps__card">
          <span className="steps__no">{s.no}</span>
          <span className="steps__icon" aria-hidden="true">{s.icon}</span>
          <h2>{s.name}</h2>
          <p>{s.says}</p>
          <SpeakButton text={`${s.no}단계, ${s.name}. ${s.says}`} />
        </section>
        <button type="button" className="steps__next" onClick={next}>
          {index + 1 === steps.length ? '문제 풀어 보기' : '다음'}
        </button>
      </LessonShell>
    );
  }

  // 문제 단계
  const q = quiz[index - steps.length];
  const answered = choice !== null;
  const correct = choice === q.answer;
  const answerStep = steps.find((s) => s.id === q.answer);
  const pick = (id) => {
    if (answered) return;
    setChoice(id);
    if (id === q.answer) setScore(score + 1);
    track('lesson_answer', { lessonId, questionId: q.id, choice: id });
  };

  return (
    <LessonShell title="이 화면은 몇 번째 단계일까요?" step={index} total={total} onExit={onExit}>
      <MiniScreen industry={q.industry} mock={q.mock} icons={q.icons} caption={q.caption} />
      <div className="steps__choices">
        {steps.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`steps__choice ${answered && s.id === q.answer ? 'is-answer' : ''} ${answered && s.id === choice && !correct ? 'is-wrong' : ''}`}
            onClick={() => pick(s.id)}
            disabled={answered}
          >
            <span className="steps__choice-no">{s.no}</span> {s.name}
          </button>
        ))}
      </div>
      {answered && (
        <p className={`steps__feedback ${correct ? 'is-ok' : 'is-ng'}`} role="status">
          {correct ? '맞았어요! 👏' : `아쉬워요. ${answerStep.no}번 '${answerStep.name}' 화면이에요.`}
        </p>
      )}
      <button type="button" className="steps__next" disabled={!answered} onClick={next}>
        {index + 1 === total ? '결과 보기' : '다음 문제'}
      </button>
    </LessonShell>
  );
}
