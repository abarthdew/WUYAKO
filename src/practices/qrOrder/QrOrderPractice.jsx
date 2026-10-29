import KioskButton from '../../components/KioskButton.jsx';
import Popup from '../../components/Popup.jsx';
import Term from '../../components/Term.jsx';
import { won } from '../../lib/format.js';
import { countOf, totalOf } from './qrOrderModel.js';
import QrCode from './QrCode.jsx';
import './QrOrderPractice.css';

const APPS = [
  { id: 'qr-app-call', icon: '📞', label: '전화' },
  { id: 'qr-app-sms', icon: '💬', label: '문자' },
  { id: 'qr-camera', icon: '📷', label: '카메라' },
  { id: 'qr-app-photo', icon: '🖼️', label: '사진' },
];

// 내 휴대폰으로 식탁 QR을 찍어 주문하는 화면
export default function QrOrderPractice({ state, dispatch, content }) {
  const go = (type, extra) => () => dispatch({ type, ...extra });
  const { cart } = state;
  const count = countOf(cart);
  const total = totalOf(cart, content.menu);

  if (state.screen === 'home') {
    return (
      <div className="qr qr--home">
        <p className="qr__hint">식탁 위에 이런 네모 그림(QR)이 있어요</p>
        <figure className="qr__sticker">
          <QrCode className="qr__code" />
          <figcaption>{content.table}번 식탁 · 찍어서 주문하세요</figcaption>
        </figure>
        <div className="qr__apps">
          {APPS.map((a) => (
            <KioskButton key={a.id} id={a.id} variant="ghost" className="qr__app" onClick={a.id === 'qr-camera' ? go('OPEN_CAMERA') : undefined}>
              <span className="qr__app-icon" aria-hidden="true">{a.icon}</span>
              <span data-label>{a.label}</span>
            </KioskButton>
          ))}
        </div>
      </div>
    );
  }

  if (state.screen === 'camera') {
    return (
      <div className="qr qr--camera">
        <div className="qr__viewfinder">
          <QrCode className="qr__code qr__code--live" />
          <span className="qr__corners" aria-hidden="true" />
        </div>
        <KioskButton id="qr-link" variant="accent" className="qr__link" onClick={go('OPEN_LINK')}>
          <span aria-hidden="true">🔗</span>
          <span data-label>
            <Term easy="주문 화면 열기" real="링크 열기" />
          </span>
        </KioskButton>
        <p className="qr__hint qr__hint--dark">카메라를 QR에 비추면 노란 알림이 떠요</p>
      </div>
    );
  }

  if (state.screen === 'menu' || state.screen === 'cart') {
    return (
      <div className="qr qr--web">
        <header className="qr__web-head">
          <strong>{content.storeName}</strong>
          <span>{content.table}번 식탁</span>
        </header>
        {state.screen === 'menu' ? (
          <ul className="qr__menu">
            {content.menu.map((m) => (
              <li key={m.id}>
                <span className="qr__menu-icon" aria-hidden="true">{m.icon}</span>
                <span className="qr__menu-name">
                  {m.name}
                  <small>{won(m.price)}</small>
                </span>
                <KioskButton id={`qr-add-${m.id}`} aria-label={`${m.name} 담기`} onClick={go('ADD', { id: m.id })}>
                  담기
                </KioskButton>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="qr__menu">
            {content.menu.filter((m) => cart[m.id]).map((m) => (
              <li key={m.id}>
                <span className="qr__menu-icon" aria-hidden="true">{m.icon}</span>
                <span className="qr__menu-name">
                  {m.name}
                  <small>{won(m.price * cart[m.id])}</small>
                </span>
                <span className="qr__qty">
                  <KioskButton id={`qr-minus-${m.id}`} aria-label={`${m.name} 하나 빼기`} onClick={go('REMOVE', { id: m.id })}>−</KioskButton>
                  <strong>{cart[m.id]}</strong>
                  <KioskButton id={`qr-plus-${m.id}`} aria-label={`${m.name} 하나 더`} onClick={go('ADD', { id: m.id })}>+</KioskButton>
                </span>
              </li>
            ))}
            {!count && <li className="qr__empty">담은 메뉴가 없어요</li>}
          </ul>
        )}
        <footer className="qr__bar">
          {state.screen === 'menu' ? (
            <KioskButton id="qr-open-cart" variant="primary" disabled={!count} onClick={go('OPEN_CART')}>
              <span data-label>
                <Term easy="담은 것 보기" real="장바구니" />
              </span>{' '}
              {count}개 · {won(total)}
            </KioskButton>
          ) : (
            <div className="qr__bar-row">
              <KioskButton id="qr-back" escape onClick={go('BACK_TO_MENU')}>더 담기</KioskButton>
              <KioskButton id="qr-order" variant="primary" disabled={!count} onClick={go('ORDER')}>
                <span data-label>주문하기</span> {won(total)}
              </KioskButton>
            </div>
          )}
        </footer>
        {state.confirm && (
          <Popup title="이대로 주문할까요?" closeId="qr-close" onClose={go('CONFIRM_NO')}>
            <p className="qr__confirm-text">계산은 다 드시고 카운터에서 해요.</p>
            <div className="qr__bar-row">
              <KioskButton id="qr-no" escape onClick={go('CONFIRM_NO')}>아니요</KioskButton>
              <KioskButton id="qr-yes" variant="primary" onClick={go('CONFIRM_YES')}>
                <span data-label>예, 주문할게요</span>
              </KioskButton>
            </div>
          </Popup>
        )}
      </div>
    );
  }

  // ordered: 주문 접수
  return (
    <div className="qr qr--web qr--ordered">
      <p className="qr__done-icon" aria-hidden="true">✅</p>
      <h2>주문이 들어갔어요</h2>
      <p className="qr__hint">음식이 나올 때까지 자리에서 기다리세요.</p>
      <KioskButton id="qr-finish" variant="primary" onClick={go('FINISH')}>확인</KioskButton>
    </div>
  );
}
