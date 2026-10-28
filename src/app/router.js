import { useEffect, useState } from 'react';

// 해시 라우터 (서버 설정 없이 정적 배포 가능). 예: #/kiosk/stage1-v1?theme=fastfood
const parse = () => {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [path, qs = ''] = raw.split('?');
  return { path, parts: path.split('/').filter(Boolean), query: Object.fromEntries(new URLSearchParams(qs)) };
};

export const useRoute = () => {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const onChange = () => setRoute(parse());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
};

export const navigate = (path) => {
  window.location.hash = path;
};
