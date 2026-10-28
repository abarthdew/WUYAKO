import { useEffect, useState } from 'react';
import { fetchPublished } from './api.js';

// 게시 문서 하나를 읽는 훅. { status: 'loading' | 'ready', data }
// 요청 대상(kind/slug)이 바뀌면 이전 문서를 내보내지 않도록 key로 구분한다.
export const useDocument = (kind, slug) => {
  const key = `${kind}/${slug}`;
  const [state, setState] = useState({ key: null, data: null });
  useEffect(() => {
    let alive = true;
    if (!slug) {
      setState({ key, data: null });
      return undefined;
    }
    fetchPublished(kind, slug).then((data) => alive && setState({ key, data }));
    return () => {
      alive = false;
    };
  }, [kind, slug, key]);
  return state.key === key ? { status: 'ready', data: state.data } : { status: 'loading', data: null };
};
