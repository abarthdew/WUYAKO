import './ModeScreen.css';

const MODES = [
  {
    id: 'follow',
    icon: '👆',
    title: '따라서 해볼래요',
    summary: '반짝이는 곳을 보며 혼자 눌러 봐요. 틀려도 끝까지 가고, 마지막에 틀린 곳을 알려 드려요.',
  },
  {
    id: 'help',
    icon: '🙋',
    title: '도움이 필요해요',
    summary: '엉뚱한 곳을 누르면 바로 말풍선으로 알려 드려요.',
  },
];

// 1·2단계 진입 전 연습 방식 고르기
export default function ModeScreen({ stage, onSelect, onBack }) {
  return (
    <main className="mode-screen">
      <h2>{stage.title}</h2>
      <p className="mode-screen__lead">어떻게 연습할까요?</p>
      <div className="mode-screen__choices">
        {MODES.map((m) => (
          <button key={m.id} type="button" className="mode-screen__choice" onClick={() => onSelect(m.id)}>
            <span className="mode-screen__icon" aria-hidden="true">{m.icon}</span>
            <span className="mode-screen__title">{m.title}</span>
            <span className="mode-screen__summary">{m.summary}</span>
          </button>
        ))}
      </div>
      <button type="button" className="mode-screen__back" onClick={onBack}>
        처음으로
      </button>
    </main>
  );
}
