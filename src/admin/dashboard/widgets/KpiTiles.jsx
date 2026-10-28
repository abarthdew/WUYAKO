import { num, pct } from '../format.js';

// 요약 숫자 4개
export default function KpiTiles({ data }) {
  const k = data.kpis;
  const tiles = [
    { label: '방문', value: num(k.sessions), unit: '세션' },
    { label: '키오스크 연습 시작', value: num(k.kioskStarts), unit: '회' },
    { label: '3단계 성공률', value: pct(k.stage3SuccessRate), unit: `제출 ${num(k.stage3Submits)}회 중`, key: true },
    { label: '공유 버튼', value: num(k.shareClicks), unit: '클릭' },
  ];
  return (
    <div className="dash-kpis">
      {tiles.map((t) => (
        <div key={t.label} className={`dash-kpi ${t.key ? 'is-key' : ''}`}>
          <span className="dash-kpi__label">{t.label}</span>
          <span className="dash-kpi__value">{t.value}</span>
          <span className="dash-kpi__unit">{t.unit}</span>
        </div>
      ))}
    </div>
  );
}
