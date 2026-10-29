import KioskButton from '../../components/KioskButton.jsx';
import Term from '../../components/Term.jsx';
import { formatPhone, PHONE_LEN } from './waitlistModel.js';
import './WaitlistPractice.css';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

// 가게 입구의 대기 등록 태블릿 화면
export default function WaitlistPractice({ state, dispatch, content }) {
  const go = (type, extra) => () => dispatch({ type, ...extra });

  if (state.screen === 'idle') {
    return (
      <div className="wl wl--idle">
        <p className="wl__store">{content.storeName}</p>
        <p className="wl__lead">지금은 자리가 없어요</p>
        <KioskButton id="wl-start" variant="primary" className="wl__big" onClick={go('START')}>
          <Term easy="줄 서기 (기다리기)" real="대기 등록" />
        </KioskButton>
      </div>
    );
  }

  if (state.screen === 'people') {
    return (
      <div className="wl">
        <h2 className="wl__title">몇 분이세요?</h2>
        <div className="wl__counter" aria-live="polite">
          <KioskButton id="wl-minus" aria-label="한 명 빼기" onClick={go('MINUS')}>−</KioskButton>
          <strong>{state.people}명</strong>
          <KioskButton id="wl-plus" aria-label="한 명 더하기" onClick={go('PLUS')}>+</KioskButton>
        </div>
        <KioskButton id="wl-next" variant="primary" className="wl__big" onClick={go('TO_PHONE')}>다음</KioskButton>
      </div>
    );
  }

  if (state.screen === 'phone') {
    const full = state.phone.length === PHONE_LEN;
    return (
      <div className="wl">
        <h2 className="wl__title">휴대폰 번호를 눌러 주세요</h2>
        <p className="wl__note">차례가 되면 문자로 알려 드려요</p>
        <output className="wl__phone" aria-label="입력한 번호">{formatPhone(state.phone)}</output>
        <div className="wl__keypad">
          {KEYS.map((k) => (
            <KioskButton key={k} id={`wl-key-${k}`} onClick={go('KEY', { digit: k })}>{k}</KioskButton>
          ))}
          <KioskButton id="wl-back" escape onClick={go('BACK')}>이전</KioskButton>
          <KioskButton id="wl-key-0" onClick={go('KEY', { digit: '0' })}>0</KioskButton>
          <KioskButton id="wl-del" aria-label="지우기" onClick={go('DEL')}>⌫</KioskButton>
        </div>
        <KioskButton id="wl-next" variant="primary" className="wl__big" disabled={!full} onClick={go('TO_CHECK')}>다음</KioskButton>
      </div>
    );
  }

  if (state.screen === 'check') {
    return (
      <div className="wl">
        <h2 className="wl__title">이대로 등록할까요?</h2>
        <dl className="wl__summary">
          <dt>인원</dt>
          <dd>{state.people}명</dd>
          <dt>번호</dt>
          <dd>{formatPhone(state.phone)}</dd>
        </dl>
        <div className="wl__row">
          <KioskButton id="wl-back" escape onClick={go('BACK')}>고치기</KioskButton>
          <KioskButton id="wl-submit" variant="primary" onClick={go('SUBMIT')}>
            <Term easy="등록하기" real="대기 등록" />
          </KioskButton>
        </div>
      </div>
    );
  }

  // ticket: 대기번호 확인
  return (
    <div className="wl wl--ticket">
      <p className="wl__lead">등록됐어요</p>
      <p className="wl__ticket">
        <small>
          <Term easy="내 순서 번호" real="대기번호" />
        </small>
        <strong>{content.ticketNo}번</strong>
      </p>
      <p className="wl__note">내 앞에 {content.waitingAhead}팀 기다리고 있어요</p>
      <KioskButton id="wl-finish" variant="primary" className="wl__big" onClick={go('FINISH')}>확인</KioskButton>
    </div>
  );
}
