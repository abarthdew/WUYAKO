import { useRef } from 'react';
import { useStage } from '../app/StageContext.js';
import GuideBubble from '../features/guide/GuideBubble.jsx';
import StageTimer from '../features/stage/StageTimer.jsx';
import './KioskFrame.css';

// 시뮬레이션 키오스크 외곽. 단계별 스타일은 data-stage, 기기 형태(kiosk·tablet·phone)는 data-device, 스킨은 data-skin으로 분기한다.
export default function KioskFrame({ storeName, device = 'kiosk', skin = 'color', startedAt, bubble = false, onCloseBubble, children }) {
  const { stage, target, onOffGuide } = useStage();
  const screenRef = useRef(null);
  // 버튼이 아닌 빈 곳을 눌러도 안내 (버튼은 KioskButton이 직접 처리)
  const onScreenClick = (e) => {
    if (!target || stage.guide === 'none') return;
    if (e.target.closest('button, .guide-bubble')) return;
    onOffGuide?.();
  };
  return (
    <div className={`kiosk ${target ? 'has-guide' : ''}`} data-stage={stage.id} data-device={device} data-skin={skin}>
      <header className="kiosk__bar">
        <span>{storeName}</span>
        <StageTimer limitSec={stage.timeLimitSec} startedAt={startedAt} />
      </header>
      <div className="kiosk__screen" ref={screenRef} onClick={onScreenClick}>
        {children}
        {bubble && target && <GuideBubble key={target} screenRef={screenRef} onClose={onCloseBubble} />}
      </div>
    </div>
  );
}
