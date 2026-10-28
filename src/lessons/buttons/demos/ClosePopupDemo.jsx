import { useState } from 'react';
import './Demo.css';

export default function ClosePopupDemo({ icon, onSuccess }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="demo">
      <div className="demo__body">
        <p className="demo__hint">{open ? '' : '창이 닫혔어요'}</p>
      </div>
      {open && (
        <div className="demo__popup" role="dialog" aria-label="광고 창">
          <button type="button" className="demo__btn" aria-label="닫기" onClick={() => { setOpen(false); onSuccess(); }}>
            {icon}
          </button>
          <p>🍦 아이스크림도 드실래요?</p>
        </div>
      )}
    </div>
  );
}
