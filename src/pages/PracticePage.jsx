import { navigate } from '../app/router.js';
import Notice from '../components/Notice.jsx';
import { readFrame } from '../features/frame/frame.js';
import { getStage } from '../features/stage/stages.js';
import PracticeRunner from '../practices/PracticeRunner.jsx';
import { getPractice, nextPractice } from '../practices/registry.js';

// #/practice/:id?stage=1&device=&skin= → 짧은 연습. 단계(가이드 정도)·외곽은 주소로 고른다 (기본 1단계).
// 끝나면 유형 순서(A → B → D → C)대로 다음 연습을 권한다.
export default function PracticePage({ practiceId, query = {} }) {
  const practice = getPractice(practiceId);
  if (!practice) return <Notice text="없는 화면이에요." onHome={() => navigate('/')} />;
  const stage = getStage(Number(query.stage) || 1);
  const next = nextPractice(practice.id);
  return (
    <PracticeRunner
      key={`${practice.id}-${stage.id}`}
      practice={practice}
      stage={stage}
      frame={readFrame(query, practice)}
      onExit={() => navigate('/')}
      onNext={next ? () => navigate(`/practice/${next.id}`) : null}
    />
  );
}
