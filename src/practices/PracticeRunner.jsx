import { useEffect, useMemo, useReducer, useState } from 'react';
import { StageContext } from '../app/StageContext.js';
import KioskFrame from '../components/KioskFrame.jsx';
import { useTrack } from '../features/analytics/TrackingContext.js';
import { DEVICES } from '../features/flowType/flowTypes.js';
import LessonDone from '../lessons/LessonDone.jsx';
import MissionScreen from '../screens/MissionScreen.jsx';
import './PracticeRunner.css';

const RESET = '@practice/reset';
const withReset = (model) => (s, a) => (a.type === RESET ? model.init() : model.reduce(s, a));

// 짧은 연습 실행기: 미션 → 화면 → 결과. 화면·규칙은 practice(model, component)에서 주입받는다.
// 가이드가 있는 단계는 엉뚱한 곳을 누르면 막고 말풍선으로 알린다.
export default function PracticeRunner({ practice, stage, onExit }) {
  const { model, content } = practice;
  const mission = content.mission;
  const track = useTrack();
  const [phase, setPhase] = useState('mission');
  const reducer = useMemo(() => withReset(model), [model]);
  const [state, dispatch] = useReducer(reducer, undefined, model.init);
  const [startedAt, setStartedAt] = useState(null);
  const [bubble, setBubble] = useState(false);
  const target = phase === 'play' && stage.guide !== 'none' ? model.targetOf(state, mission) : null;

  const ctx = useMemo(
    () => ({ stage, target, screen: state.screen, blockOffGuide: true, onOffGuide: () => setBubble(true) }),
    [stage, target, state.screen],
  );
  useEffect(() => setBubble(false), [target]);

  useEffect(() => {
    if (phase !== 'play' || !model.isFinished(state)) return;
    track('practice_done', { practiceId: practice.id, stage: stage.id, ...model.rawOf(state) });
    setPhase('done');
  }, [phase, state, model, practice.id, stage.id, track]);

  const begin = () => {
    track('practice_start', { practiceId: practice.id, stage: stage.id });
    dispatch({ type: RESET });
    setStartedAt(Date.now());
    setPhase('play');
  };

  if (phase === 'mission') return <MissionScreen stage={stage} mission={mission} onBegin={begin} onBack={onExit} />;

  if (phase === 'done') {
    const result = model.resultOf(state, mission);
    return (
      <main className="practice-done">
        <LessonDone message={result.success ? '잘하셨어요!' : '거의 다 왔어요!'} onRetry={() => setPhase('mission')} onExit={onExit} />
        {result.mistakes.length > 0 && (
          <ul className="practice-done__mistakes">
            {result.mistakes.map((m) => <li key={m}>{m}</li>)}
          </ul>
        )}
      </main>
    );
  }

  return (
    <StageContext.Provider value={ctx}>
      <KioskFrame
        storeName={practice.device === 'phone' ? DEVICES.phone : content.storeName}
        device={practice.device}
        startedAt={startedAt}
        bubble={bubble}
        onCloseBubble={() => setBubble(false)}
      >
        <practice.component state={state} dispatch={dispatch} content={content} />
      </KioskFrame>
    </StageContext.Provider>
  );
}
