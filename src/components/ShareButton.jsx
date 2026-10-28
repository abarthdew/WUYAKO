import { useState } from 'react';
import { useTrack } from '../features/analytics/TrackingContext.js';
import { shareLink } from '../features/share/share.js';
import './ShareButton.css';

const NOTICE = {
  copy: '링크를 복사했어요. 카톡 대화창에 붙여 넣어 보내세요.',
  failed: '공유하지 못했어요. 주소창의 주소를 복사해 보내 주세요.',
};

// 카톡으로 보내기. 아이콘은 자체 제작(말풍선)이며 카카오 공식 로고가 아니다.
export default function ShareButton({ place, label, text }) {
  const track = useTrack();
  const [notice, setNotice] = useState('');
  const onClick = async () => {
    setNotice('');
    const method = await shareLink({ place, text });
    track('share_click', { place, method });
    setNotice(NOTICE[method] ?? '');
  };
  return (
    <div className="share">
      <button type="button" className="share__btn" onClick={onClick}>
        <svg className="share__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4C7 4 3 7.1 3 11c0 2.4 1.6 4.6 4 5.9L6.2 20l3.6-2.3c.7.1 1.4.2 2.2.2 5 0 9-3.1 9-7s-4-6.9-9-6.9z" />
        </svg>
        {label}
      </button>
      {notice && <p className="share__notice" role="status">{notice}</p>}
    </div>
  );
}
