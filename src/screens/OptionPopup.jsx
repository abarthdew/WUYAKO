import KioskButton from '../components/KioskButton.jsx';
import Popup from '../components/Popup.jsx';
import Term from '../components/Term.jsx';
import { won } from '../lib/format.js';
import './OptionPopup.css';

export default function OptionPopup({ option, store, dispatch, onAdd }) {
  const menu = store.menu.find((m) => m.id === option.menuId);
  const { setOption } = store;
  const set = (patch) => dispatch({ type: 'SET_OPTION', patch });
  const ready = option.set === false || (option.set && option.drinkId);

  return (
    <Popup title={menu.name} onClose={() => dispatch({ type: 'CLOSE_OPTION' })}>
      <div className="opt__row">
        <KioskButton
          id="opt-single"
          variant={option.set === false ? 'selected' : 'default'}
          onClick={() => set({ set: false, drinkId: null })}
        >
          <Term easy="햄버거만" real="단품" />
          <small>{won(menu.price)}</small>
        </KioskButton>
        <KioskButton
          id="opt-set"
          variant={option.set ? 'selected' : 'default'}
          onClick={() => set({ set: true })}
        >
          <Term easy={setOption.easy} real={setOption.real} />
          <small>{won(menu.price + setOption.extraPrice)}</small>
        </KioskButton>
      </div>

      {option.set && (
        <fieldset className="opt__drinks">
          <legend>
            <Term easy="마실 것 고르기" real="음료 선택" />
          </legend>
          {setOption.drinks.map((d) => (
            <KioskButton
              key={d.id}
              id={`drink-${d.id}`}
              variant={option.drinkId === d.id ? 'selected' : 'default'}
              onClick={() => set({ drinkId: d.id })}
            >
              {d.name}
              {d.extraPrice > 0 && <small> +{won(d.extraPrice)}</small>}
            </KioskButton>
          ))}
        </fieldset>
      )}

      <KioskButton
        id="opt-add"
        variant="primary"
        disabled={!ready}
        onClick={() => onAdd({ menuId: menu.id, set: option.set, drinkId: option.drinkId, qty: 1 })}
      >
        <Term easy="담기" real="장바구니 담기" />
      </KioskButton>
    </Popup>
  );
}
