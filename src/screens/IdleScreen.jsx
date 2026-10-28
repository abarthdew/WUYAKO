import KioskButton from '../components/KioskButton.jsx';
import './IdleScreen.css';

export default function IdleScreen({ onTouch }) {
  return (
    <KioskButton id="idle-touch" variant="ghost" className="idle" onClick={onTouch}>
      <span className="idle__emoji" aria-hidden="true">
        🍔
      </span>
      <span className="idle__text" data-label>주문하시려면 화면을 터치하세요</span>
    </KioskButton>
  );
}
