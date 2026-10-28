import { useRef, useState } from 'react';
import './Demo.css';
import './SwipeDemo.css';

const SLIDES = ['🍔', '🍟', '🥤'];
const THRESHOLD = 40;

// 손가락(또는 마우스)을 대고 옆으로 밀면 다음 장
export default function SwipeDemo({ onSuccess }) {
  const [index, setIndex] = useState(0);
  const startX = useRef(null);
  const end = (x) => {
    if (startX.current === null) return;
    const dx = x - startX.current;
    startX.current = null;
    if (Math.abs(dx) < THRESHOLD) return;
    const next = Math.min(SLIDES.length - 1, Math.max(0, index + (dx < 0 ? 1 : -1)));
    setIndex(next);
    if (next !== index) onSuccess();
  };
  return (
    <div className="demo">
      <div
        className="swipe"
        data-testid="swipe-area"
        onPointerDown={(e) => { startX.current = e.clientX; }}
        onPointerUp={(e) => end(e.clientX)}
        onPointerCancel={() => { startX.current = null; }}
      >
        <div className="swipe__track" style={{ '--slide': index }}>
          {SLIDES.map((s) => (
            <span key={s} className="swipe__slide">{s}</span>
          ))}
        </div>
      </div>
      <p className="demo__hint swipe__hint">{index + 1} / {SLIDES.length} · 손가락으로 왼쪽으로 쓱 밀어 보세요</p>
    </div>
  );
}
