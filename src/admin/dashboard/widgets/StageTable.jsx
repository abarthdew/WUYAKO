import { getStage } from '../../../features/stage/stages.js';
import { dur, MODE_LABEL, num, pct } from '../format.js';

const Row = ({ label, s }) => (
  <tr>
    <td>{label}</td>
    <td>{num(s.starts)}</td>
    <td>{num(s.submits)}</td>
    <td>{pct(s.successRate)}</td>
    <td>{dur(s.medianDurationMs)}</td>
    <td>{num(s.offGuideTaps)}</td>
  </tr>
);

// 단계별 + 연습 방식별 성과
export default function StageTable({ data }) {
  const stages = [...data.stages].sort((a, b) => a.stage - b.stage);
  const modes = [...data.stagesByMode].sort((a, b) => a.stage - b.stage || String(a.mode).localeCompare(String(b.mode)));
  if (!stages.length) return <p className="dash-empty">아직 기록이 없어요.</p>;
  return (
    <table className="dash-table">
      <thead>
        <tr><th>단계</th><th>시작</th><th>제출</th><th>성공률</th><th>중간 소요</th><th>가이드와 다르게 누름</th></tr>
      </thead>
      <tbody>
        {stages.map((s) => (
          <Row key={s.stage} label={getStage(s.stage).title} s={s} />
        ))}
        {modes.map((s) => (
          <Row key={`${s.stage}-${s.mode}`} label={`└ ${s.stage}단계 · ${MODE_LABEL[s.mode] ?? s.mode}`} s={s} />
        ))}
      </tbody>
    </table>
  );
}
