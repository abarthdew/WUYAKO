// 카카오 JavaScript SDK 지연 로드 (키가 있을 때만). 버전·무결성 해시 고정.
const SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.9/kakao.min.js';
const SDK_SRI = 'sha384-JpLApTkB8lPskhVMhT+m5Ln8aHlnS0bsIexhaak0jOhAkMYedQoVghPfSpjNi9K1';

let loading = null;

export const loadKakao = (key) => {
  if (window.Kakao) {
    if (!window.Kakao.isInitialized()) window.Kakao.init(key);
    return Promise.resolve(window.Kakao);
  }
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SDK_URL;
    s.integrity = SDK_SRI;
    s.crossOrigin = 'anonymous';
    s.onload = () => {
      window.Kakao.init(key);
      resolve(window.Kakao);
    };
    s.onerror = () => {
      loading = null;
      reject(new Error('kakao_sdk_load_failed'));
    };
    document.head.appendChild(s);
  });
  return loading;
};
