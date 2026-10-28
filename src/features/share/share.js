import { loadKakao } from './kakaoSdk.js';

// 공유 링크: 메인 화면 + 유입 경로 표시(UTM). 받은 사람이 열면 sessions.entry_url에 원문으로 남는다.
export const shareUrl = (place) => {
  const url = new URL(window.location.pathname, window.location.origin);
  url.searchParams.set('utm_source', 'kakao');
  url.searchParams.set('utm_medium', 'share');
  url.searchParams.set('utm_campaign', place);
  return url.toString();
};

// 공유 시도 순서: 카카오 SDK(키 있을 때) → 휴대폰 공유창 → 링크 복사. 실제로 쓴 방법을 돌려준다.
export const shareLink = async ({ place, text, kakaoKey = import.meta.env?.VITE_KAKAO_JS_KEY }) => {
  const url = shareUrl(place);
  if (kakaoKey) {
    try {
      const Kakao = await loadKakao(kakaoKey);
      Kakao.Share.sendDefault({ objectType: 'text', text, link: { mobileWebUrl: url, webUrl: url } });
      return 'kakao';
    } catch {
      // SDK 실패 → 다음 방법
    }
  }
  if (navigator.share) {
    try {
      await navigator.share({ title: '우야꼬', text, url });
      return 'webshare';
    } catch (err) {
      if (err?.name === 'AbortError') return 'cancelled';
    }
  }
  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    return 'copy';
  } catch {
    return 'failed';
  }
};
