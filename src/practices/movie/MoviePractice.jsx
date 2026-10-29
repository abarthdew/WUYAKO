import KioskButton from '../../components/KioskButton.jsx';
import Term from '../../components/Term.jsx';
import { won } from '../../lib/format.js';
import './MoviePractice.css';

// 영화관 예매 키오스크 화면
export default function MoviePractice({ state, dispatch, content }) {
  const go = (type, extra) => () => dispatch({ type, ...extra });
  const show = content.shows.find((x) => x.id === state.showId);
  const date = content.dates.find((d) => d.id === state.date);
  const back = <KioskButton id="mv-back" escape className="mv__back" onClick={go('BACK')}>‹ 이전</KioskButton>;

  if (state.screen === 'when') {
    return (
      <div className="mv">
        <h2 className="mv__title">언제 보실 건가요?</h2>
        <div className="mv__dates" role="tablist" aria-label="날짜">
          {content.dates.map((d) => (
            <KioskButton key={d.id} id={`mv-date-${d.id}`} role="tab" aria-selected={state.date === d.id}
              variant={state.date === d.id ? 'selected' : 'default'} onClick={go('SET_DATE', { id: d.id })}>
              <span data-label>{d.label}</span>
              <small>{d.sub}</small>
            </KioskButton>
          ))}
        </div>
        <ul className="mv__shows">
          {content.shows.map((x) => (
            <li key={x.id}>
              <KioskButton id={`mv-show-${x.id}`} className="mv__show" onClick={go('PICK_SHOW', { id: x.id })}>
                <strong data-label>{x.time}</strong>
                <span>{x.movie}</span>
                <small>{x.hall}</small>
              </KioskButton>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (state.screen === 'people') {
    return (
      <div className="mv">
        {back}
        <p className="mv__picked">{date.label} {show.time} · {show.movie}</p>
        <h2 className="mv__title">몇 분이 보시나요?</h2>
        <div className="mv__counter" aria-live="polite">
          <KioskButton id="mv-minus" aria-label="한 명 빼기" onClick={go('MINUS')}>−</KioskButton>
          <strong>
            <Term easy="어른" real="일반" /> {state.people}명
          </strong>
          <KioskButton id="mv-plus" aria-label="한 명 더하기" onClick={go('PLUS')}>+</KioskButton>
        </div>
        <KioskButton id="mv-next" variant="primary" className="mv__big" onClick={go('TO_SEAT')}>
          <Term easy="자리 고르기" real="좌석 선택" />
        </KioskButton>
      </div>
    );
  }

  if (state.screen === 'seat') {
    const left = state.people - state.seats.length;
    return (
      <div className="mv">
        {back}
        <h2 className="mv__title">{left ? `자리를 ${left}개 더 골라 주세요` : '자리를 다 골랐어요'}</h2>
        <div className="mv__screen-bar" aria-hidden="true">스크린</div>
        <div className="mv__seats" style={{ '--cols': content.seatCols }}>
          {content.seatRows.flatMap((r) =>
            Array.from({ length: content.seatCols }, (_, i) => {
              const id = `${r}${i + 1}`;
              const taken = content.taken.includes(id);
              const mine = state.seats.includes(id);
              return (
                <KioskButton key={id} id={`mv-seat-${id}`} aria-label={`${id} ${taken ? '팔림' : mine ? '고름' : '빈자리'}`}
                  className={`mv__seat ${mine ? 'is-mine' : ''}`} disabled={taken} onClick={go('TOGGLE_SEAT', { id })}>
                  {id}
                </KioskButton>
              );
            }),
          )}
        </div>
        <p className="mv__legend">
          <span className="mv__dot" /> 빈자리 <span className="mv__dot is-mine" /> 고른 자리 <span className="mv__dot is-taken" /> 팔린 자리
        </p>
        <KioskButton id="mv-next" variant="primary" className="mv__big" disabled={!!left} onClick={go('TO_PAY')}>다음</KioskButton>
      </div>
    );
  }

  if (state.screen === 'pay') {
    return (
      <div className="mv">
        {back}
        <h2 className="mv__title">
          {won(content.price * state.people)}
        </h2>
        <p className="mv__picked">{show.movie} · {state.seats.join(', ')}</p>
        <div className="mv__pays">
          <KioskButton id="mv-pay-card" className="mv__big" onClick={go('PAY', { method: 'card' })}>
            <span aria-hidden="true">💳</span> <Term easy="카드로 내기" real="신용카드" />
          </KioskButton>
          <KioskButton id="mv-pay-mobile" className="mv__big" onClick={go('PAY', { method: 'mobile' })}>
            <span aria-hidden="true">📱</span> <Term easy="휴대폰으로 내기" real="간편결제" />
          </KioskButton>
        </div>
      </div>
    );
  }

  return (
    <div className="mv mv--ticket">
      <p className="mv__title">표가 나왔어요</p>
      <dl className="mv__stub">
        <dt>영화</dt>
        <dd>{show.movie}</dd>
        <dt>시간</dt>
        <dd>{date.label} {show.time} · {show.hall}</dd>
        <dt>자리</dt>
        <dd>{state.seats.join(', ')}</dd>
      </dl>
      <KioskButton id="mv-finish" variant="primary" className="mv__big" onClick={go('FINISH')}>확인</KioskButton>
    </div>
  );
}
