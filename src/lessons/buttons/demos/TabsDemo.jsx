import { useState } from 'react';
import './Demo.css';

const TABS = [
  { id: 'burger', label: '버거', items: '🍔 🍔 🍔' },
  { id: 'drink', label: '음료', items: '🥤 🧃 🥤' },
];

export default function TabsDemo({ onSuccess }) {
  const [tab, setTab] = useState('burger');
  const pick = (id) => {
    setTab(id);
    if (id === 'drink') onSuccess();
  };
  return (
    <div className="demo">
      <div className="demo__bar" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={`demo__btn ${tab === t.id ? 'is-on' : ''}`} onClick={() => pick(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="demo__body">
        <span className="demo__big">{TABS.find((t) => t.id === tab).items}</span>
        <p className="demo__hint">'음료' 이름표를 눌러 보세요</p>
      </div>
    </div>
  );
}
