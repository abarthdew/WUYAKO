import { useState } from 'react';
import './Demo.css';

export default function OpenMenuDemo({ icon, onSuccess }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="demo">
      <div className="demo__bar">
        <button type="button" className="demo__btn" aria-label="메뉴 열기" onClick={() => { setOpen(true); onSuccess(); }}>
          {icon}
        </button>
        <span>우야꼬 가게</span>
      </div>
      <div className="demo__body">
        <p className="demo__hint">왼쪽 위 {icon} 버튼을 눌러 보세요</p>
      </div>
      {open && (
        <nav className="demo__drawer" aria-label="열린 메뉴">
          <strong>숨어 있던 메뉴</strong>
          <span>🍔 햄버거</span>
          <span>🥤 음료</span>
          <span>🏠 처음으로</span>
        </nav>
      )}
    </div>
  );
}
