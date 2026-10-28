import KioskButton from '../components/KioskButton.jsx';
import Term from '../components/Term.jsx';
import { cartTotal, describeLine, lineKey, linePrice } from '../features/cart/cart.js';
import { won } from '../lib/format.js';
import './CartScreen.css';

export default function CartScreen({ state, store, dispatch }) {
  const { cart } = state;
  return (
    <div className="cart">
      <h2 className="cart__title">
        <Term easy="고른 것 확인" real="주문 내역" />
      </h2>
      <ul className="cart__list">
        {cart.map((line) => {
          const key = lineKey(line);
          return (
            <li key={key} className="cart__line">
              <span className="cart__name">{describeLine(line, store)}</span>
              <span className="cart__qty">
                <KioskButton id={`minus-${key}`} aria-label="하나 빼기" onClick={() => dispatch({ type: 'CHANGE_QTY', key, delta: -1 })}>
                  −
                </KioskButton>
                <strong>{line.qty}</strong>
                <KioskButton id={`plus-${key}`} aria-label="하나 더" onClick={() => dispatch({ type: 'CHANGE_QTY', key, delta: 1 })}>
                  +
                </KioskButton>
              </span>
              <span className="cart__price">{won(linePrice(line, store))}</span>
            </li>
          );
        })}
      </ul>
      <p className="cart__total">합계 {won(cartTotal(cart, store))}</p>
      <div className="cart__actions">
        <KioskButton id="cart-back" escape onClick={() => dispatch({ type: 'GO', screen: 'menu' })}>
          ‹ <Term easy="더 고르기" real="추가 주문" />
        </KioskButton>
        <KioskButton
          id="cart-pay"
          variant="primary"
          disabled={cart.length === 0}
          onClick={() => dispatch({ type: 'GO', screen: 'payment' })}
        >
          <Term easy="돈 내기" real="결제하기" />
        </KioskButton>
      </div>
    </div>
  );
}
