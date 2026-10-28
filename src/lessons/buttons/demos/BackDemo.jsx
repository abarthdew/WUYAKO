import { useState } from 'react';
import './Demo.css';

export default function BackDemo({ icon, onSuccess }) {
  const [page, setPage] = useState(2);
  return (
    <div className="demo">
      <div className="demo__bar">
        <button type="button" className="demo__btn" aria-label="뒤로 가기" disabled={page === 1} onClick={() => { setPage(1); onSuccess(); }}>
          {icon}
        </button>
        <span>{page === 2 ? '2. 음료 고르기' : '1. 햄버거 고르기'}</span>
      </div>
      <div className="demo__body">
        <p className="demo__hint">{page === 2 ? `잘못 왔어요! ${icon} 를 눌러 돌아가 보세요` : '전 화면으로 돌아왔어요'}</p>
      </div>
    </div>
  );
}
