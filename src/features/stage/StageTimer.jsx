import { useEffect, useState } from 'react';
import './StageTimer.css';

// 3단계 실전 압박용 표시. 0이 돼도 진행을 막지 않는다.
export default function StageTimer({ limitSec, startedAt }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!limitSec || !startedAt) return null;
  const left = Math.max(0, limitSec - Math.floor((now - startedAt) / 1000));
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  return (
    <div className={`stage-timer ${left <= 30 ? 'is-low' : ''}`} role="timer">
      남은 시간 {mm}:{ss}
    </div>
  );
}
