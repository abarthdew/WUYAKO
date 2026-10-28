import KioskButton from '../components/KioskButton.jsx';
import Term from '../components/Term.jsx';
import './DineScreen.css';

export default function DineScreen({ onSelect }) {
  return (
    <div className="dine">
      <h2 className="dine__title">어디서 드시나요?</h2>
      <div className="dine__choices">
        <KioskButton id="dine-in" onClick={() => onSelect('in')}>
          <span className="dine__icon" aria-hidden="true">🍽️</span>
          <Term easy="여기서 먹기" real="매장 식사" />
        </KioskButton>
        <KioskButton id="dine-out" onClick={() => onSelect('out')}>
          <span className="dine__icon" aria-hidden="true">🛍️</span>
          <Term easy="싸 가기" real="포장" />
        </KioskButton>
      </div>
    </div>
  );
}
