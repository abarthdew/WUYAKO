import { STAGES } from '../features/stage/stages.js';
import './HomeScreen.css';

// 우야꼬 자체 화면: 접근성 기준 준수
export default function HomeScreen({ onStart }) {
  return (
    <main className="home">
      <p className="home__eyebrow">키오스크 외우지 마세요</p>
      <h1 className="home__title">
        읽는 법을
        <br />
        배우세요
      </h1>
      <p className="home__lead">햄버거 가게 키오스크로 연습해요. 틀려도 괜찮아요.</p>
      <div className="home__stages">
        {Object.values(STAGES).map((s) => (
          <button key={s.id} type="button" className="home__stage" onClick={() => onStart(s.id)}>
            <span className="home__stage-no">{s.id}</span>
            <span>{s.title}</span>
          </button>
        ))}
      </div>
    </main>
  );
}
