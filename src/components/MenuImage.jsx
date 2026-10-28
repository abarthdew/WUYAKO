import { assetUrl } from '../content/assets.js';
import './MenuImage.css';

// 메뉴 그림: 업로드 이미지가 있으면 이미지, 없으면 이모지
export default function MenuImage({ item, size = 'md' }) {
  const src = assetUrl(item.imageAssetId);
  if (src) return <img className={`menu-img menu-img--${size}`} src={src} alt="" loading="lazy" />;
  return (
    <span className={`menu-emoji menu-emoji--${size}`} aria-hidden="true">
      {item.emoji}
    </span>
  );
}
