import KioskButton from '../../components/KioskButton.jsx';
import Term from '../../components/Term.jsx';
import { won } from '../../lib/format.js';
import { countIn, totalOf } from './selfCheckoutModel.js';
import './SelfCheckoutPractice.css';

// 마트 셀프 계산대 화면. 바구니 물건을 누르면 바코드를 찍은 것으로 친다.
export default function SelfCheckoutPractice({ state, dispatch, content }) {
  const go = (type, extra) => () => dispatch({ type, ...extra });
  const total = totalOf(state, content);
  const back = <KioskButton id="sc-back" escape className="sc__back" onClick={go('BACK')}>‹ 이전</KioskButton>;

  if (state.screen === 'idle') {
    return (
      <div className="sc sc--center">
        <p className="sc__store">{content.storeName}</p>
        <p className="sc__note">직원 없이 직접 계산하는 곳이에요</p>
        <KioskButton id="sc-start" variant="primary" className="sc__big" onClick={go('START')}>
          <Term easy="계산 시작하기" real="결제 시작" />
        </KioskButton>
      </div>
    );
  }

  if (state.screen === 'scan') {
    const lines = content.basket.filter((b) => countIn(state.scanned, b.id));
    return (
      <div className="sc">
        <h2 className="sc__title">물건의 바코드를 찍어 주세요</h2>
        <section className="sc__basket" aria-label="내 바구니">
          <p className="sc__note">🧺 내 바구니 · 누르면 바코드를 찍어요</p>
          <div className="sc__items">
            {content.basket.map((b) => (
              <KioskButton key={b.id} id={`sc-scan-${b.id}`} aria-label={`${b.name} 찍기`} className="sc__item" onClick={go('SCAN', { id: b.id })}>
                <span className="sc__icon" aria-hidden="true">{b.icon}</span>
                <span>{b.name}</span>
                <span className="sc__barcode" aria-hidden="true" />
              </KioskButton>
            ))}
          </div>
        </section>
        <ul className="sc__list" aria-label="찍은 물건">
          {lines.map((b) => (
            <li key={b.id}>
              <span>{b.name} × {countIn(state.scanned, b.id)}</span>
              <span>{won(b.price * countIn(state.scanned, b.id))}</span>
              <KioskButton id={`sc-remove-${b.id}`} aria-label={`${b.name} 하나 빼기`} className="sc__remove" onClick={go('REMOVE', { id: b.id })}>
                <Term easy="빼기" real="취소" />
              </KioskButton>
            </li>
          ))}
          {!lines.length && <li className="sc__empty">아직 찍은 물건이 없어요</li>}
        </ul>
        <KioskButton id="sc-next" variant="primary" className="sc__big" disabled={!lines.length} onClick={go('TO_BAG')}>
          <span data-label>계산하기</span> {won(total)}
        </KioskButton>
      </div>
    );
  }

  if (state.screen === 'bag') {
    return (
      <div className="sc sc--center">
        {back}
        <h2 className="sc__title">
          <Term easy="비닐 봉지" real="봉투" />가 필요하세요?
        </h2>
        <div className="sc__row">
          <KioskButton id="sc-bag-0" className="sc__big" onClick={go('BAG', { count: 0 })}>필요 없어요</KioskButton>
          <KioskButton id="sc-bag-1" className="sc__big" onClick={go('BAG', { count: 1 })}>
            <span data-label>1장</span> <small>{won(content.bagPrice)}</small>
          </KioskButton>
        </div>
      </div>
    );
  }

  if (state.screen === 'pay') {
    return (
      <div className="sc sc--center">
        {back}
        <h2 className="sc__title">{won(total)}</h2>
        <p className="sc__note">어떻게 내시겠어요?</p>
        <div className="sc__row">
          <KioskButton id="sc-pay-card" className="sc__big" onClick={go('PAY', { method: 'card' })}>
            <span aria-hidden="true">💳</span> <Term easy="카드" real="신용카드" />
          </KioskButton>
          <KioskButton id="sc-pay-mobile" className="sc__big" onClick={go('PAY', { method: 'mobile' })}>
            <span aria-hidden="true">📱</span> <Term easy="휴대폰" real="간편결제" />
          </KioskButton>
        </div>
      </div>
    );
  }

  return (
    <div className="sc sc--center">
      <p className="sc__done" aria-hidden="true">✅</p>
      <h2 className="sc__title">계산이 끝났어요</h2>
      <p className="sc__note">
        <Term easy="계산한 종이" real="영수증" />을 받으시겠어요?
      </p>
      <div className="sc__row">
        <KioskButton id="sc-receipt-no" className="sc__big" onClick={go('RECEIPT')}>안 받을래요</KioskButton>
        <KioskButton id="sc-receipt-yes" className="sc__big" onClick={go('RECEIPT')}>받을게요</KioskButton>
      </div>
    </div>
  );
}
