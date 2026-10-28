import Badge from '../components/Badge.jsx';
import MenuImage from '../components/MenuImage.jsx';
import KioskButton from '../components/KioskButton.jsx';
import Term from '../components/Term.jsx';
import { useStage } from '../app/StageContext.js';
import { cartTotal, countItems } from '../features/cart/cart.js';
import { won } from '../lib/format.js';
import OptionPopup from './OptionPopup.jsx';
import UpsellPopup from './UpsellPopup.jsx';
import './MenuScreen.css';

export default function MenuScreen({ state, store, dispatch, onAdd, onCancel }) {
  const { stage } = useStage();
  const items = store.menu.filter((m) => m.category === state.category);
  const count = countItems(state.cart);

  const pick = (menu) =>
    menu.options === 'set'
      ? dispatch({ type: 'OPEN_OPTION', menuId: menu.id })
      : onAdd({ menuId: menu.id, set: false, drinkId: null, qty: 1 });

  return (
    <div className={`menu menu--${stage.menuLayout}`}>
      <nav className="menu__tabs" aria-label="메뉴 종류">
        {store.categories.map((c) => (
          <KioskButton
            key={c.id}
            id={`cat-${c.id}`}
            variant={c.id === state.category ? 'selected' : 'default'}
            aria-pressed={c.id === state.category}
            onClick={() => dispatch({ type: 'SELECT_CATEGORY', category: c.id })}
          >
            <Term easy={c.easy} real={c.real} />
          </KioskButton>
        ))}
      </nav>

      <ul className="menu__grid">
        {items.map((m) => (
          <li key={m.id}>
            <KioskButton id={`menu-${m.id}`} className="menu__item" onClick={() => pick(m)}>
              <MenuImage item={m} />
              <span className="menu__name" data-label>{m.name}</span>
              <span className="menu__price">{won(m.price)}</span>
            </KioskButton>
          </li>
        ))}
      </ul>

      <footer className="menu__bar">
        <KioskButton id="order-cancel" variant="ghost" escape onClick={onCancel}>
          <Term easy="처음부터" real="처음으로" />
        </KioskButton>
        <span className="menu__total">
          🛒 <Badge count={count} /> {won(cartTotal(state.cart, store))}
        </span>
        <KioskButton
          id="cart-go"
          variant="primary"
          disabled={count === 0}
          onClick={() => dispatch({ type: 'GO', screen: 'cart' })}
        >
          <Term easy="고른 것 보기" real="주문하기" />
        </KioskButton>
      </footer>

      {state.option && <OptionPopup option={state.option} store={store} dispatch={dispatch} onAdd={onAdd} />}
      {state.upsell && <UpsellPopup store={store} dispatch={dispatch} onAdd={onAdd} />}
    </div>
  );
}
