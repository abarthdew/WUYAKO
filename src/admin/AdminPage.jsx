import { useEffect, useState } from 'react';
import { navigate } from '../app/router.js';
import { adminApi, getToken, setToken } from './adminApi.js';
import LoginForm from './LoginForm.jsx';
import Dashboard from './dashboard/Dashboard.jsx';
import LayoutEditor from './layout/LayoutEditor.jsx';
import ThemeEditor from './theme/ThemeEditor.jsx';
import './Admin.css';

// 관리 도구 목록. 탭을 추가하려면 여기에 등록한다.
const TOOLS = [
  { id: 'dashboard', label: '대시보드', component: Dashboard },
  { id: 'theme', label: '업종 테마', component: ThemeEditor },
  { id: 'layout', label: '메인 화면', component: LayoutEditor },
];

export default function AdminPage({ tool = 'dashboard' }) {
  const [authed, setAuthed] = useState(null);
  useEffect(() => {
    if (!getToken()) {
      setAuthed(false);
      return;
    }
    adminApi.checkSession().then(() => setAuthed(true), () => setAuthed(false));
  }, []);

  if (authed === null) return <p className="admin-wrap">확인 중…</p>;
  if (!authed) return <div className="admin-wrap"><LoginForm onLogin={() => setAuthed(true)} /></div>;

  const Tool = (TOOLS.find((t) => t.id === tool) ?? TOOLS[0]).component;
  return (
    <div className="admin-wrap admin-wrap--wide">
      <header className="admin-head">
        <strong>우야꼬 관리자</strong>
        <nav className="admin-tabs">
          {TOOLS.map((t) => (
            <button key={t.id} type="button" className={`admin-tab ${t.id === tool ? 'is-on' : ''}`} onClick={() => navigate(`/admin/${t.id}`)}>
              {t.label}
            </button>
          ))}
        </nav>
        <span className="admin-head__right">
          <button type="button" className="admin-btn" onClick={() => navigate('/')}>사이트 보기</button>
          <button type="button" className="admin-btn" onClick={() => { setToken(''); setAuthed(false); }}>나가기</button>
        </span>
      </header>
      <Tool />
    </div>
  );
}
