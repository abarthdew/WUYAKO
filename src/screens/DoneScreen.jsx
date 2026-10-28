import ShareButton from '../components/ShareButton.jsx';
import { describeLine } from '../features/cart/cart.js';
import { describeMistakes } from '../features/mission/describeMistakes.js';
import './DoneScreen.css';

export default function DoneScreen({ result, store, mission, offGuideTaps = 0, onRetry, onNext, onHome }) {
  const nameOf = (key) => {
    const [menuId, set, drinkId] = key.split('|');
    return describeLine({ menuId, set: set === '1', drinkId: drinkId || null, qty: 1 }, store);
  };
  if (!result) {
    return (
      <main className="done is-success">
        <div className="done__burst" aria-hidden="true">🎉</div>
        <h2 className="done__title">주문 완료!</h2>
        <div className="done__actions">
          <button type="button" onClick={onRetry}>한 번 더</button>
          <button type="button" onClick={onHome}>처음으로</button>
        </div>
      </main>
    );
  }
  return (
    <main className={`done ${result.success ? 'is-success' : ''}`}>
      {result.success ? (
        <>
          <div className="done__burst" aria-hidden="true">🎉</div>
          <h2 className="done__title">잘하셨어요!</h2>
          <p>미션 성공! 이제 가게에서도 할 수 있어요.</p>
          <ShareButton place="done" label="카톡으로 자랑하기" text="나 키오스크 주문 성공했어! 우야꼬에서 연습했지 😎" />
        </>
      ) : (
        <>
          <h2 className="done__title">주문은 됐어요!</h2>
          <p>미션과 조금 달라요. 한 번 더 해 볼까요?</p>
        </>
      )}

      {!result.success && (
        <section className="done__mistakes" aria-label="틀린 곳">
          <h3>틀린 곳</h3>
          <ul>
            {describeMistakes(result, mission, nameOf).map((m) => (
              <li key={m.key}>{m.text}</li>
            ))}
          </ul>
        </section>
      )}
      {offGuideTaps > 0 && (
        <p className="done__offguide">
          반짝이는 곳과 다른 곳을 <strong>{offGuideTaps}번</strong> 눌렀어요. 다음엔 반짝이는 곳을 따라가 보세요.
        </p>
      )}

      <table className="done__table">
        <caption>미션과 내 주문 비교</caption>
        <thead>
          <tr>
            <th scope="col">메뉴</th>
            <th scope="col">미션</th>
            <th scope="col">내 주문</th>
          </tr>
        </thead>
        <tbody>
          {result.items.map((i) => (
            <tr key={i.key} className={i.want === i.got ? 'ok' : 'ng'}>
              <td>{nameOf(i.key)}</td>
              <td>{i.want}</td>
              <td>{i.got}</td>
            </tr>
          ))}
          <tr className={result.dineOk ? 'ok' : 'ng'}>
            <td>먹는 곳</td>
            <td colSpan={2}>{result.dineOk ? '맞았어요' : `미션: ${mission.dine === 'in' ? '매장' : '포장'}`}</td>
          </tr>
        </tbody>
      </table>

      <div className="done__actions">
        <button type="button" onClick={onRetry}>한 번 더</button>
        {onNext && (
          <button type="button" className="is-primary" onClick={onNext}>
            다음 단계 도전
          </button>
        )}
        <button type="button" onClick={onHome}>처음으로</button>
      </div>
    </main>
  );
}
