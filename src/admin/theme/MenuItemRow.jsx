import { useRef, useState } from 'react';
import MenuImage from '../../components/MenuImage.jsx';
import { adminApi } from '../adminApi.js';

// 메뉴 한 줄: 이름·가격·종류·이모지·이미지·세트 여부
export default function MenuItemRow({ item, categories, onChange, onRemove }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const { id } = await adminApi.uploadAsset(file);
      onChange({ imageAssetId: id });
    } catch (err) {
      setError(err.data?.error === 'too_large' ? '5MB 이하만 올릴 수 있어요' : '올리기 실패 (png·jpg·webp·gif)');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <tr>
      <td><MenuImage item={item} size="sm" /></td>
      <td><input aria-label="메뉴 이름" value={item.name} onChange={(e) => onChange({ name: e.target.value })} /></td>
      <td>
        <input className="num" aria-label="가격" type="number" min="0" step="100" value={item.price}
          onChange={(e) => onChange({ price: Number.parseInt(e.target.value || '0', 10) })} />
      </td>
      <td>
        <select aria-label="종류" value={item.category} onChange={(e) => onChange({ category: e.target.value })}>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.real}</option>)}
        </select>
      </td>
      <td><input className="num" aria-label="이모지" value={item.emoji ?? ''} onChange={(e) => onChange({ emoji: e.target.value })} /></td>
      <td>
        <label className="admin-row">
          <input type="checkbox" checked={item.options === 'set'} onChange={(e) => onChange({ options: e.target.checked ? 'set' : undefined })} />
          세트
        </label>
      </td>
      <td>
        <div className="admin-row">
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={(e) => upload(e.target.files?.[0])} />
          <button type="button" className="admin-btn admin-btn--small" disabled={uploading} onClick={() => fileRef.current?.click()}>
            {uploading ? '올리는 중…' : '이미지'}
          </button>
          {item.imageAssetId && (
            <button type="button" className="admin-btn admin-btn--small" onClick={() => onChange({ imageAssetId: undefined })}>이미지 빼기</button>
          )}
          <button type="button" className="admin-btn admin-btn--small" onClick={onRemove} aria-label={`${item.name} 삭제`}>삭제</button>
        </div>
        {error && <p className="admin-error">{error}</p>}
      </td>
    </tr>
  );
}
