import { useState } from 'react';
import SpeakButton from '../../components/SpeakButton.jsx';
import { track } from '../../features/analytics/analytics.js';
import LessonDone from '../LessonDone.jsx';
import LessonShell from '../LessonShell.jsx';
import { DEMOS } from './demos/index.js';
import './ButtonsLesson.css';

// 구조 학습 ①: 버튼 하나씩 모양 보기 → 뜻 듣기 → 직접 해 보기
export default function ButtonsLesson({ lessonId, content, onExit }) {
  const { items } = content;
  const [step, setStep] = useState(0);
  const [tried, setTried] = useState(false);
  const item = items[step];

  const succeed = () => {
    if (tried) return;
    setTried(true);
    track('lesson_step', { lessonId, itemId: item.id });
  };
  const next = () => {
    setTried(false);
    setStep(step + 1);
    if (step + 1 === items.length) track('lesson_done', { lessonId });
  };
  const retry = () => {
    track('lesson_start', { lessonId });
    setStep(0);
    setTried(false);
  };

  if (step >= items.length) {
    return (
      <LessonShell title={content.title} step={items.length} total={items.length} onExit={onExit}>
        <LessonDone message="버튼 박사가 됐어요!" onRetry={retry} onExit={onExit} />
      </LessonShell>
    );
  }

  const Demo = DEMOS[item.demo] ?? DEMOS.tap;
  return (
    <LessonShell title={content.title} step={step} total={items.length} onExit={onExit}>
      {step === 0 && <p className="btn-lesson__intro">{content.intro}</p>}
      <section className="btn-lesson__card" aria-live="polite">
        <span className="btn-lesson__icon" aria-hidden="true">{item.icon}</span>
        <h2 className="btn-lesson__name">{item.name}</h2>
        <p className="btn-lesson__real">진짜 이름: {item.realName}</p>
        <p className="btn-lesson__says">{item.says}</p>
        <SpeakButton text={`${item.name}. ${item.says}`} />
      </section>

      <section className="btn-lesson__try">
        <h3>직접 해 보세요</h3>
        <Demo icon={item.icon} onSuccess={succeed} />
        {tried && <p className="btn-lesson__cheer">잘하셨어요! 👏</p>}
      </section>

      <button type="button" className="btn-lesson__next" disabled={!tried} onClick={next}>
        {step + 1 === items.length ? '다 했어요' : '다음 버튼'}
      </button>
    </LessonShell>
  );
}
