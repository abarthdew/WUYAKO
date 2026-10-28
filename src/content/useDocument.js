import { useEffect, useState } from 'react';
import { fetchPublished } from './api.js';

// 게시 문서 하나를 읽는 훅. { status: 'loading' | 'ready', data }
export const useDocument = (kind, slug) => {
  const [state, setState] = useState({ status: 'loading', data: null });
  useEffect(() => {
    let alive = true;
    setState({ status: 'loading', data: null });
    fetchPublished(kind, slug).then((data) => alive && setState({ status: 'ready', data }));
    return () => {
      alive = false;
    };
  }, [kind, slug]);
  return state;
};
