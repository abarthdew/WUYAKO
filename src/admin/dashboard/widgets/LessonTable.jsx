import { getLesson } from '../../../lessons/registry.js';
import { num, pct } from '../format.js';

// 원리 학습 모듈별 시작·완료·정답률
export default function LessonTable({ data }) {
  if (!data.lessons.length) return <p className="dash-empty">아직 기록이 없어요.</p>;
  return (
    <table className="dash-table">
      <thead><tr><th>학습</th><th>시작</th><th>완료</th><th>완료율</th><th>정답률</th></tr></thead>
      <tbody>
        {data.lessons.map((l) => (
          <tr key={l.lessonId}>
            <td>{getLesson(l.lessonId)?.title ?? l.lessonId}</td>
            <td>{num(l.starts)}</td>
            <td>{num(l.dones)}</td>
            <td>{pct(l.completionRate)}</td>
            <td>{l.answers ? `${pct(l.accuracy)} (${num(l.answers)}문항)` : '–'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
