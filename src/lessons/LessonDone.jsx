import './LessonDone.css';

export default function LessonDone({ message = '다 배웠어요!', onRetry, onExit, onNext, nextLabel = '다음' }) {
  return (
    <section className="lesson-done">
      <div className="lesson-done__burst" aria-hidden="true">🎉</div>
      <h2>{message}</h2>
      <div className="lesson-done__actions">
        <button type="button" onClick={onRetry}>한 번 더</button>
        {onNext && <button type="button" className="is-primary" onClick={onNext}>{nextLabel}</button>}
        <button type="button" className={onNext ? '' : 'is-primary'} onClick={onExit}>처음으로</button>
      </div>
    </section>
  );
}
