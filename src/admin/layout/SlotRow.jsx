import { SKINS } from '../../features/frame/frame.js';
import { DEVICES } from '../../features/flowType/flowTypes.js';
import { SLOT_TYPES } from '../../home/slotTypes.jsx';
import { listVersions } from '../../kiosk/versions/registry.js';
import { listLessons } from '../../lessons/registry.js';
import { getPractice, listPractices } from '../../practices/registry.js';

// 칸 한 줄: 순서·공개·종류별 설정·외곽·삭제
export default function SlotRow({ slot, index, count, themes, onChange, onMove, onRemove }) {
  const framed = slot.type === 'kiosk' || slot.type === 'practice';
  const deviceFixed = slot.type === 'practice' && getPractice(slot.ref)?.fixedDevice;
  return (
    <li className={`slot-row ${slot.visible === false ? 'is-hidden' : ''}`}>
      <span className="slot-row__no">{index + 1}</span>
      <span className="slot-row__type">{SLOT_TYPES[slot.type]?.label ?? slot.type}</span>

      <span className="slot-row__body">
        {slot.type === 'heading' && (
          <input aria-label="제목 글자" value={slot.text} onChange={(e) => onChange({ text: e.target.value })} />
        )}
        {slot.type === 'lesson' && (
          <select aria-label="학습 모듈" value={slot.ref} onChange={(e) => onChange({ ref: e.target.value })}>
            {listLessons().map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
          </select>
        )}
        {slot.type === 'practice' && (
          <select aria-label="짧은 연습" value={slot.ref} onChange={(e) => onChange({ ref: e.target.value })}>
            {listPractices().map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        )}
        {slot.type === 'kiosk' && (
          <>
            <select aria-label="화면 버전" value={slot.ref} onChange={(e) => onChange({ ref: e.target.value })}>
              {listVersions().map((v) => <option key={v.id} value={v.id}>{v.id} ({v.label})</option>)}
            </select>
            <select aria-label="가게" value={slot.theme} onChange={(e) => onChange({ theme: e.target.value })}>
              {themes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </>
        )}
        {framed && (
          <>
            <select aria-label="기기 형태" value={deviceFixed ? 'phone' : slot.device ?? 'kiosk'} disabled={deviceFixed}
              onChange={(e) => onChange({ device: e.target.value })}>
              {Object.entries(DEVICES).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
            <select aria-label="스킨" value={slot.skin ?? 'color'} onChange={(e) => onChange({ skin: e.target.value })}>
              {Object.entries(SKINS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
          </>
        )}
      </span>

      <span className="slot-row__actions">
        <label className="admin-row">
          <input type="checkbox" checked={slot.visible !== false} onChange={(e) => onChange({ visible: e.target.checked })} />
          보이기
        </label>
        <button type="button" className="admin-btn admin-btn--small" aria-label={`${index + 1}번 위로`} disabled={index === 0} onClick={() => onMove(-1)}>▲</button>
        <button type="button" className="admin-btn admin-btn--small" aria-label={`${index + 1}번 아래로`} disabled={index === count - 1} onClick={() => onMove(1)}>▼</button>
        <button type="button" className="admin-btn admin-btn--small" aria-label={`${index + 1}번 삭제`} onClick={onRemove}>삭제</button>
      </span>
    </li>
  );
}
