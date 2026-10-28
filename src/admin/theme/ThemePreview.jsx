import { useState } from 'react';
import { noTracking, TrackingContext } from '../../features/analytics/TrackingContext.js';
import KioskRunner from '../../kiosk/KioskRunner.jsx';
import { getVersion, listVersions } from '../../kiosk/versions/registry.js';

// 편집 중인 테마로 키오스크를 바로 돌려 본다 (미션 없음 = 자유 주문)
export default function ThemePreview({ theme }) {
  const [versionId, setVersionId] = useState('stage1-v1');
  const [nonce, setNonce] = useState(0);
  return (
    <aside className="admin-preview">
      <div className="admin-row">
        <strong>미리보기</strong>
        <select aria-label="화면 버전" value={versionId} onChange={(e) => setVersionId(e.target.value)}>
          {listVersions().map((v) => <option key={v.id} value={v.id}>{v.id}</option>)}
        </select>
        <button type="button" className="admin-btn admin-btn--small" onClick={() => setNonce(nonce + 1)}>처음부터</button>
      </div>
      <TrackingContext.Provider value={noTracking}>
        <KioskRunner key={`${versionId}-${nonce}`} version={getVersion(versionId)} theme={theme} mission={null} onExit={() => setNonce(nonce + 1)} />
      </TrackingContext.Provider>
    </aside>
  );
}
