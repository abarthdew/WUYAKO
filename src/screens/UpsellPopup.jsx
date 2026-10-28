import KioskButton from '../components/KioskButton.jsx';
import Popup from '../components/Popup.jsx';
import { won } from '../lib/format.js';
import './UpsellPopup.css';

// 3단계 전용: 현실 키오스크의 추가 메뉴 권유를 재현
export default function UpsellPopup({ store, dispatch, onAdd }) {
  const menu = store.menu.find((m) => m.id === store.upsell.menuId);
  const close = () => dispatch({ type: 'CLOSE_UPSELL' });
  return (
    <Popup title="함께 드시면 좋아요!" onClose={close} closeId="upsell-close">
      <p className="upsell__offer">
        {menu.emoji} {menu.name} {won(menu.price)}
      </p>
      <div className="upsell__actions">
        <KioskButton id="upsell-add" variant="primary" onClick={() => onAdd({ menuId: menu.id, set: false, drinkId: null, qty: 1 })}>
          추가하기
        </KioskButton>
        <KioskButton id="upsell-skip" onClick={close}>
          괜찮아요
        </KioskButton>
      </div>
    </Popup>
  );
}
