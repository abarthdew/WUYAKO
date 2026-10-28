import { useState } from 'react';
import './Demo.css';

export default function TapDemo({ icon, onSuccess }) {
  const [home, setHome] = useState(false);
  return (
    <div className="demo">
      <div className="demo__bar">
        <span>{home ? '처음 화면' : '3. 결제하기'}</span>
        <button type="button" className="demo__btn" aria-label="처음으로" onClick={() => { setHome(true); onSuccess(); }}>
          {icon}
        </button>
      </div>
      <div className="demo__body">
        <p className="demo__hint">{home ? '맨 처음으로 돌아왔어요' : `막혔어요! ${icon} 를 눌러 처음으로 가 보세요`}</p>
      </div>
    </div>
  );
}
