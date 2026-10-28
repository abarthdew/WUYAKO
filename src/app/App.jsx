import HomeScreen from '../screens/HomeScreen.jsx';
import KioskPage from '../pages/KioskPage.jsx';
import Notice from '../components/Notice.jsx';
import { navigate, useRoute } from './router.js';
import './App.css';

// 화면 라우팅만 담당
export default function App() {
  const { parts, query } = useRoute();
  const [section, id] = parts;

  const page = (() => {
    if (!section) return <HomeScreen />;
    if (section === 'kiosk') return <KioskPage versionId={id} themeSlug={query.theme} />;
    return <Notice text="없는 화면이에요." onHome={() => navigate('/')} />;
  })();

  return <div className="app">{page}</div>;
}
