import './Badge.css';

export default function Badge({ count }) {
  if (!count) return null;
  return (
    <span className="badge" aria-label={`${count}개`}>
      {count}
    </span>
  );
}
