import { useState } from 'react';
import './Demo.css';

export default function BadgeDemo({ icon, onSuccess }) {
  const [count, setCount] = useState(0);
  const add = () => {
    const n = count + 1;
    setCount(n);
    if (n >= 2) onSuccess();
  };
  return (
    <div className="demo">
      <div className="demo__body">
        <button type="button" className="demo__btn" onClick={add}>🍔 담기</button>
        <span className="demo__cart" aria-label={`장바구니 ${count}개`}>
          {icon}
          {count > 0 && <span className="demo__badge">{count}</span>}
        </span>
        <p className="demo__hint">'담기'를 두 번 누르고 빨간 숫자를 보세요</p>
      </div>
    </div>
  );
}
