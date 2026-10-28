import { useStage } from '../app/StageContext.js';
import { track } from '../features/analytics/analytics.js';
import GuideHand from '../features/guide/GuideHand.jsx';
import './KioskButton.css';

export default function KioskButton({ id, variant = 'default', className = '', onClick, children, ...rest }) {
  const { target, screen } = useStage();
  const isTarget = id && id === target;
  const handleClick = (e) => {
    // 누른 곳과 그때 가이드가 가리킨 곳을 원물로 남긴다
    track('tap', { targetId: id ?? null, screen, guideTargetId: target ?? null });
    onClick?.(e);
  };
  return (
    <button
      type="button"
      data-id={id}
      className={`kbtn kbtn--${variant} ${isTarget ? 'is-target' : ''} ${className}`}
      onClick={handleClick}
      {...rest}
    >
      {children}
      {isTarget && <GuideHand />}
    </button>
  );
}
