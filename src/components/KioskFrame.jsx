import { useStage } from '../app/StageContext.js';
import StageTimer from '../features/stage/StageTimer.jsx';
import './KioskFrame.css';

// 시뮬레이션 키오스크 외곽. 단계별 스타일은 data-stage로 분기한다.
export default function KioskFrame({ storeName, startedAt, children }) {
  const { stage, target } = useStage();
  return (
    <div className={`kiosk ${target ? 'has-guide' : ''}`} data-stage={stage.id}>
      <header className="kiosk__bar">
        <span>{storeName}</span>
        <StageTimer limitSec={stage.timeLimitSec} startedAt={startedAt} />
      </header>
      <div className="kiosk__screen">{children}</div>
    </div>
  );
}
