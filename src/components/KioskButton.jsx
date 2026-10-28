import { useStage } from '../app/StageContext.js';
import { useTrack } from '../features/analytics/TrackingContext.js';
import GuideHand from '../features/guide/GuideHand.jsx';
import './KioskButton.css';

// escape: 처음으로·닫기·뒤로 같은 탈출 버튼. 가이드 중에도 항상 동작한다.
export default function KioskButton({ id, variant = 'default', className = '', escape = false, onClick, children, ...rest }) {
  const { stage, target, screen, onOffGuide } = useStage();
  const track = useTrack();
  const isTarget = id && id === target;
  const handleClick = (e) => {
    // 누른 곳과 그때 가이드가 가리킨 곳을 원물로 남긴다
    track('tap', { targetId: id ?? null, screen, guideTargetId: target ?? null });
    // 가이드 단계에서 엉뚱한 버튼: 동작하지 않고 말풍선으로 안내
    if (target && !isTarget && !escape && stage?.guide !== 'none') {
      onOffGuide?.();
      return;
    }
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
      {isTarget && stage?.guide === 'hand' && <GuideHand />}
    </button>
  );
}
