import { useEffect, useState } from 'react';
import { adminApi } from '../adminApi.js';
import { WIDGETS } from './widgets.js';
import './Dashboard.css';

const RANGES = [
  { id: '7', label: '최근 7일' },
  { id: '30', label: '최근 30일' },
  { id: 'all', label: '전체' },
];

// 관리자 대시보드: 기간 선택 → 지표 한 번에 받아 등록된 위젯에 나눠 준다
export default function Dashboard() {
  const [days, setDays] = useState('7');
  const [state, setState] = useState({ status: 'loading' });

  useEffect(() => {
    let alive = true;
    setState({ status: 'loading' });
    adminApi.metricsOverview(days).then(
      (data) => alive && setState({ status: 'ready', data }),
      () => alive && setState({ status: 'error' }),
    );
    return () => {
      alive = false;
    };
  }, [days]);

  return (
    <div className="dash">
      <div className="dash-filters" role="group" aria-label="기간">
        {RANGES.map((r) => (
          <button key={r.id} type="button" className={`admin-tab ${days === r.id ? 'is-on' : ''}`} aria-pressed={days === r.id} onClick={() => setDays(r.id)}>
            {r.label}
          </button>
        ))}
        <span className="dash-note">모든 수치는 저장된 원물 기록에서 지금 계산한 값이에요.</span>
      </div>
      {state.status === 'loading' && <p>불러오는 중…</p>}
      {state.status === 'error' && <p className="admin-error">지표를 불러오지 못했어요. API 서버가 켜져 있는지 확인하세요.</p>}
      {state.status === 'ready' && (
        <div className="dash-grid">
          {WIDGETS.map(({ id, title, component: Widget, wide }) => (
            <section key={id} className={`dash-card ${wide ? 'is-wide' : ''}`} aria-label={title ?? '요약'}>
              {title && <h2>{title}</h2>}
              <Widget data={state.data} />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
