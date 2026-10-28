import { useStage } from '../app/StageContext.js';
import './Term.css';

// termMode: easy(쉬운 말 크게 + 실제 용어 작게) / both(실제 용어 크게 + 쉬운 말 작게) / real(실제 용어만)
export default function Term({ easy, real }) {
  const { stage } = useStage();
  const mode = stage?.termMode ?? 'real';
  if (mode === 'real' || !easy || easy === real) return <span className="term" data-label>{real}</span>;
  const [big, small] = mode === 'easy' ? [easy, real] : [real, easy];
  return (
    <span className="term term--dual">
      <span className="term__big" data-label>{big}</span>
      <span className="term__small">{small}</span>
    </span>
  );
}
