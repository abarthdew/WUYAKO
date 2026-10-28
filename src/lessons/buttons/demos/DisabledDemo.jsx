import { useState } from 'react';
import './Demo.css';

export default function DisabledDemo({ onSuccess }) {
  const [picked, setPicked] = useState(false);
  const [paid, setPaid] = useState(false);
  return (
    <div className="demo">
      <div className="demo__body">
        <button type="button" className={`demo__btn ${picked ? 'is-on' : ''}`} onClick={() => setPicked(true)}>🍔 고르기</button>
        <button type="button" className="demo__btn" disabled={!picked} onClick={() => { setPaid(true); onSuccess(); }}>
          결제하기
        </button>
        <p className="demo__hint">
          {paid ? '눌렸어요!' : picked ? '색이 바뀌었죠? 이제 결제하기를 눌러 보세요' : '회색 결제하기는 아직 안 눌려요. 먼저 고르기를 누르세요'}
        </p>
      </div>
    </div>
  );
}
