import { useStage } from '../app/StageContext.js';
import GuideHand from '../features/guide/GuideHand.jsx';
import './KioskButton.css';

export default function KioskButton({ id, variant = 'default', className = '', children, ...rest }) {
  const { target } = useStage();
  const isTarget = id && id === target;
  return (
    <button
      type="button"
      data-id={id}
      className={`kbtn kbtn--${variant} ${isTarget ? 'is-target' : ''} ${className}`}
      {...rest}
    >
      {children}
      {isTarget && <GuideHand />}
    </button>
  );
}
