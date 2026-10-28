import { describeLine } from '../features/cart/cart.js';
import './DoneScreen.css';

export default function DoneScreen({ result, store, mission, onRetry, onNext, onHome }) {
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
        </>
      ) : (
        <>
          <h2 className="done__title">주문은 됐어요!</h2>
          <p>미션과 조금 달라요. 한 번 더 해 볼까요?</p>
        </>
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
