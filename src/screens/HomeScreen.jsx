import { useEffect, useState } from 'react';
import { navigate } from '../app/router.js';
import { listPublished } from '../content/api.js';
import { listVersions } from '../kiosk/versions/registry.js';
import { listLessons } from '../lessons/registry.js';
import { getStage } from '../features/stage/stages.js';
import './HomeScreen.css';

// 우야꼬 자체 화면: 접근성 기준 준수. (메인 화면 조합은 ABTHDW-55에서 관리자 구성으로 교체)
export default function HomeScreen() {
  const [themes, setThemes] = useState([]);
  const [theme, setTheme] = useState('fastfood');
  useEffect(() => {
    listPublished('theme').then(setThemes);
  }, []);

  return (
    <main className="home">
      <p className="home__eyebrow">키오스크 외우지 마세요</p>
      <h1 className="home__title">
        읽는 법을
        <br />
        배우세요
      </h1>
      <p className="home__lead">틀려도 괜찮아요. 몇 번이든 다시 해 보세요.</p>

      {themes.length > 1 && (
        <label className="home__theme">
          가게 고르기
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            {themes.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.body.storeName}
              </option>
            ))}
          </select>
        </label>
      )}

      <h2 className="home__section">원리 배우기</h2>
      <div className="home__stages">
        {listLessons().map((l) => (
          <button key={l.id} type="button" className="home__stage" onClick={() => navigate(`/lesson/${l.id}`)}>
            <span className="home__stage-no">{l.icon}</span>
            <span className="home__stage-text">
              <span>{l.title}</span>
              <small>{l.summary}</small>
            </span>
          </button>
        ))}
      </div>

      <h2 className="home__section">키오스크 연습</h2>
      <div className="home__stages">
        {listVersions().map((v) => {
          const s = getStage(v.stage);
          return (
            <button key={v.id} type="button" className="home__stage" onClick={() => navigate(`/kiosk/${v.id}?theme=${theme}`)}>
              <span className="home__stage-no">{s.id}</span>
              <span className="home__stage-text">
                <span>{s.title}</span>
                <small>{s.summary}</small>
              </span>
            </button>
          );
        })}
      </div>
    </main>
  );
}
