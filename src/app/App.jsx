import HomeScreen from '../screens/HomeScreen.jsx';
import KioskPage from '../pages/KioskPage.jsx';
import LessonPage from '../pages/LessonPage.jsx';
import PracticePage from '../pages/PracticePage.jsx';
import AdminPage from '../admin/AdminPage.jsx';
import Notice from '../components/Notice.jsx';
import { navigate, useRoute } from './router.js';
import './App.css';

// 화면 라우팅만 담당
export default function App() {
  const { parts, query } = useRoute();
  const [section, id] = parts;

  const page = (() => {
    if (!section) return <HomeScreen />;
    if (section === 'kiosk') return <KioskPage versionId={id} themeSlug={query.theme} query={query} />;
    if (section === 'lesson') return <LessonPage lessonId={id} />;
    if (section === 'practice') return <PracticePage practiceId={id} query={query} />;
    if (section === 'admin') return <AdminPage tool={id} />;
    return <Notice text="없는 화면이에요." onHome={() => navigate('/')} />;
  })();

  return <div className="app">{page}</div>;
}
