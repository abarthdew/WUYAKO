import { useStage } from '../app/StageContext.js';
import './Term.css';

// 1단계: 쉬운 말 크게 + 실제 용어 작게 / 3단계: 실제 용어만
export default function Term({ easy, real }) {
  const { stage } = useStage();
  if (stage?.termMode !== 'easy' || !easy || easy === real) return <span className="term">{real}</span>;
  return (
    <span className="term term--dual">
      <span className="term__easy">{easy}</span>
      <span className="term__real">{real}</span>
    </span>
  );
}
