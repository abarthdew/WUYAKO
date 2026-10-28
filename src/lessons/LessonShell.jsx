import './LessonShell.css';

// 학습 모듈 공통 틀: 제목 + 진행 점 + 처음으로
export default function LessonShell({ title, step, total, onExit, children }) {
  return (
    <main className="lesson">
      <header className="lesson__head">
        <button type="button" className="lesson__exit" onClick={onExit}>
          ‹ 처음으로
        </button>
        {total > 0 && (
          <ol className="lesson__dots" aria-label={`${total}개 중 ${step + 1}번째`}>
            {Array.from({ length: total }, (_, i) => (
              <li key={i} className={i < step ? 'is-done' : i === step ? 'is-now' : ''} />
            ))}
          </ol>
        )}
      </header>
      <h1 className="lesson__title">{title}</h1>
      {children}
    </main>
  );
}
