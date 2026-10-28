import { resolveSlot } from './slotTypes.jsx';
import '../screens/HomeScreen.css';

// 구성 문서만 보고 메인 화면을 그린다. onOpen: 칸을 눌렀을 때 (미리보기에서는 무시)
// children: 안내 문구 아래에 끼울 요소 (예: 공유 버튼)
export default function HomeLayout({ layout, onOpen, children }) {
  return (
    <main className="home">
      {layout.eyebrow && <p className="home__eyebrow">{layout.eyebrow}</p>}
      <h1 className="home__title">{layout.title}</h1>
      {layout.lead && <p className="home__lead">{layout.lead}</p>}
      {children}
      <div className="home__stages">
        {layout.slots.map((slot) => {
          const r = resolveSlot(slot);
          if (!r) return null;
          if (r.kind === 'heading') return <h2 key={slot.id} className="home__section">{r.text}</h2>;
          return (
            <button key={slot.id} type="button" className="home__stage" onClick={() => onOpen(r.path)}>
              <span className="home__stage-no" aria-hidden="true">{r.icon}</span>
              <span className="home__stage-text">
                <span>{r.title}</span>
                <small>{r.summary}</small>
              </span>
            </button>
          );
        })}
      </div>
    </main>
  );
}
