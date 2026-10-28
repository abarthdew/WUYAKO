import MissionCard from '../features/mission/MissionCard.jsx';
import './MissionScreen.css';

const HINTS = {
  hand: '손가락이 가리키는 곳을 눌러 보세요.',
  shade: '밝게 빛나는 곳이 다음에 누를 곳이에요.',
  none: '이번엔 도움 없이 해 보세요.',
};

export default function MissionScreen({ stage, mission, onBegin, onBack }) {
  return (
    <main className="mission-screen">
      <h2>{stage.title}</h2>
      {mission ? <MissionCard mission={mission} /> : <p className="mission-screen__hint">먹고 싶은 것을 자유롭게 주문해 보세요.</p>}
      <p className="mission-screen__hint">{HINTS[stage.guide]}</p>
      <button type="button" className="mission-screen__go" onClick={onBegin}>
        시작하기
      </button>
      <button type="button" className="mission-screen__back" onClick={onBack}>
        처음으로
      </button>
    </main>
  );
}
