import KioskButton from './KioskButton.jsx';
import './Popup.css';

export default function Popup({ title, onClose, closeId = 'popup-close', children }) {
  return (
    <div className="popup-dim" role="dialog" aria-modal="true" aria-label={title}>
      <div className="popup">
        <header className="popup__head">
          <h3>{title}</h3>
          <KioskButton id={closeId} variant="ghost" aria-label="닫기" onClick={onClose}>
            ×
          </KioskButton>
        </header>
        <div className="popup__body">{children}</div>
      </div>
    </div>
  );
}
