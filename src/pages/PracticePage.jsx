import { navigate } from '../app/router.js';
import Notice from '../components/Notice.jsx';
import { getStage } from '../features/stage/stages.js';
import PracticeRunner from '../practices/PracticeRunner.jsx';
import { getPractice } from '../practices/registry.js';

// #/practice/:id?stage=1 → 짧은 연습. 단계(가이드 정도)는 주소로 고른다 (기본 1단계).
export default function PracticePage({ practiceId, stageId }) {
  const practice = getPractice(practiceId);
  if (!practice) return <Notice text="없는 화면이에요." onHome={() => navigate('/')} />;
  const stage = getStage(Number(stageId) || 1);
  return <PracticeRunner key={`${practice.id}-${stage.id}`} practice={practice} stage={stage} onExit={() => navigate('/')} />;
}
