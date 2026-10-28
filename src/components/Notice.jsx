import './Notice.css';

export default function Notice({ text, onHome }) {
  return (
    <main className="notice">
      <p>{text}</p>
      {onHome && (
        <button type="button" onClick={onHome}>
          처음으로
        </button>
      )}
    </main>
  );
}
