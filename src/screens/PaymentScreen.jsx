import KioskButton from '../components/KioskButton.jsx';
import Term from '../components/Term.jsx';
import { cartTotal } from '../features/cart/cart.js';
import { won } from '../lib/format.js';
import './PaymentScreen.css';

const METHODS = [
  { id: 'card', icon: '💳', easy: '카드로 내기', real: '신용/체크카드' },
  { id: 'mobile', icon: '📱', easy: '휴대폰으로 내기', real: '간편결제' },
];

export default function PaymentScreen({ state, store, dispatch, onPaid }) {
  const { payMethod } = state;
  return (
    <div className="pay">
      <h2>
        <Term easy="어떻게 내실래요?" real="결제 수단 선택" />
      </h2>
      <p className="pay__amount">{won(cartTotal(state.cart, store))}</p>
      <div className="pay__methods">
        {METHODS.map((m) => (
          <KioskButton
            key={m.id}
            id={`pay-${m.id}`}
            variant={payMethod === m.id ? 'selected' : 'default'}
            onClick={() => dispatch({ type: 'SET_PAY', method: m.id })}
          >
            <span className="pay__icon" aria-hidden="true">{m.icon}</span>
            <Term easy={m.easy} real={m.real} />
          </KioskButton>
        ))}
      </div>
      {payMethod && (
        <KioskButton id="pay-insert" variant="accent" className="pay__insert" onClick={onPaid}>
          <span className="pay__slot" aria-hidden="true">{payMethod === 'card' ? '💳⬇️' : '📱📶'}</span>
          <span data-label>{payMethod === 'card' ? '카드를 꽂아 주세요 (눌러서 꽂기)' : '휴대폰을 대 주세요 (눌러서 대기)'}</span>
        </KioskButton>
      )}
      <KioskButton id="pay-back" variant="ghost" escape onClick={() => dispatch({ type: 'GO', screen: 'cart' })}>
        ‹ <Term easy="뒤로" real="이전" />
      </KioskButton>
    </div>
  );
}
