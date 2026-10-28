import MissionCard from '../features/mission/MissionCard.jsx';
import './MissionScreen.css';

export default function MissionScreen({ stage, mission, onBegin, onBack }) {
  return (
    <main className="mission-screen">
      <h2>{stage.title}</h2>
      <MissionCard mission={mission} />
      <p className="mission-screen__hint">
        {stage.guide ? '손가락이 가리키는 곳을 눌러 보세요.' : '이번엔 도움 없이 해 보세요.'}
      </p>
      <button type="button" className="mission-screen__go" onClick={onBegin}>
        시작하기
      </button>
      <button type="button" className="mission-screen__back" onClick={onBack}>
        처음으로
      </button>
    </main>
  );
}
