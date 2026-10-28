import { useLayoutEffect, useState } from 'react';
import './GuideBubble.css';

const GAP = 14;

// 지금 누를 버튼의 이름: aria-label → 버튼 안 이름 표시(data-label) → 글자 전체
const labelOf = (el) =>
  el.getAttribute('aria-label') || el.querySelector('[data-label]')?.textContent || el.textContent.trim();

// 엉뚱한 곳을 눌렀을 때 누를 곳을 가리키는 말풍선. screenRef 안의 .is-target을 기준으로 위치를 잡는다.
export default function GuideBubble({ screenRef, onClose }) {
  const [pos, setPos] = useState(null);

  useLayoutEffect(() => {
    const screen = screenRef.current;
    const target = screen?.querySelector('.is-target');
    if (!target) return;
    const s = screen.getBoundingClientRect();
    const t = target.getBoundingClientRect();
    const below = t.top - s.top < s.height / 2; // 위쪽 버튼이면 아래에, 아래쪽 버튼이면 위에
    setPos({
      label: labelOf(target),
      placement: below ? 'below' : 'above',
      y: below ? t.bottom - s.top + GAP : s.bottom - t.top + GAP,
      tailX: Math.min(Math.max(t.left - s.left + t.width / 2, 28), s.width - 28),
    });
  }, [screenRef]);

  if (!pos) return null;
  return (
    <div
      className={`guide-bubble guide-bubble--${pos.placement}`}
      role="alertdialog"
      aria-label="안내"
      style={{ '--bubble-y': `${pos.y}px`, '--tail-x': `${pos.tailX}px` }}
    >
      <p className="guide-bubble__title">앗, 거기가 아니에요!</p>
      <p className="guide-bubble__text">
        반짝이는 <strong>「{pos.label}」</strong> 버튼을 눌러 보세요.
      </p>
      <button type="button" className="guide-bubble__close" onClick={onClose}>
        닫기
      </button>
    </div>
  );
}
