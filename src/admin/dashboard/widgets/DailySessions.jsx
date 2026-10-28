import { num } from '../format.js';

// 일별 방문 세션 막대 (단일 계열 → 범례 없음, 제목이 이름)
export default function DailySessions({ data }) {
  const rows = data.daily;
  const max = Math.max(1, ...rows.map((r) => r.count));
  // 처음·가운데·끝 날짜 (하루뿐이면 하나)
  const ticks = [...new Set([rows[0], rows[Math.floor(rows.length / 2)], rows.at(-1)])].filter(Boolean);
  return (
    <figure className="dash-bars">
      <div className="dash-bars__plot" role="img" aria-label={`일별 방문 세션, 최대 ${max}`}>
        <span className="dash-bars__max">{num(max)}</span>
        {rows.map((r) => (
          <span key={r.day} className="dash-bars__col" style={{ '--h': r.count / max }} tabIndex={0} aria-label={`${r.day} ${r.count}세션`}>
            <span className="dash-bars__bar" />
            <span className="dash-bars__tip" role="tooltip">
              {r.day.slice(5)} · {num(r.count)}세션
            </span>
          </span>
        ))}
      </div>
      <figcaption className="dash-bars__axis">
        {ticks.map((t) => (
          <span key={t.day}>{t.day.slice(5)}</span>
        ))}
      </figcaption>
      <details className="dash-table-toggle">
        <summary>표로 보기</summary>
        <table className="dash-table">
          <thead><tr><th>날짜</th><th>세션</th></tr></thead>
          <tbody>{rows.map((r) => <tr key={r.day}><td>{r.day}</td><td>{num(r.count)}</td></tr>)}</tbody>
        </table>
      </details>
    </figure>
  );
}
