import { useEffect, useState } from 'react';
import { listPublished } from '../../content/api.js';
import { FALLBACK } from '../../content/fallback.js';
import { validateLayout } from '../../features/layout/validateLayout.js';
import HomeLayout from '../../home/HomeLayout.jsx';
import { SLOT_TYPES } from '../../home/slotTypes.jsx';
import { listVersions } from '../../kiosk/versions/registry.js';
import { listLessons } from '../../lessons/registry.js';
import { listPractices } from '../../practices/registry.js';
import { adminApi } from '../adminApi.js';
import * as M from './layoutModel.js';
import SlotRow from './SlotRow.jsx';
import './LayoutEditor.css';

const SLUG = 'home';

// 메인 화면 조합: 칸 추가·순서·보이기·설정 → 초안/게시, 오른쪽 미리보기
export default function LayoutEditor() {
  const [layout, setLayout] = useState(null);
  const [themes, setThemes] = useState([]);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    adminApi.getDocument('layout', SLUG).then(
      (d) => setLayout(d.body),
      () => {
        setLayout(structuredClone(FALLBACK.layout.home));
        setMsg({ ok: true, text: '저장된 구성이 없어 기본 구성으로 시작해요.' });
      },
    );
    listPublished('theme').then((list) => setThemes(list.map((t) => t.slug)));
  }, []);

  if (!layout) return <p>불러오는 중…</p>;

  const ctx = { lessons: listLessons().map((l) => l.id), versions: listVersions().map((v) => v.id), practices: listPractices().map((p) => p.id), themes };
  const errors = validateLayout(layout, themes.length ? ctx : { ...ctx, themes: null });
  const edit = (fn) => {
    setLayout((l) => fn(l));
    setMsg(null);
  };

  const save = async (publish) => {
    try {
      await adminApi.saveDocument('layout', SLUG, layout, publish);
      setMsg({ ok: true, text: publish ? '게시했어요. 메인 화면에 바로 반영돼요.' : '초안으로 저장했어요 (아직 게시 전).' });
    } catch (err) {
      setMsg({ ok: false, text: err.data?.errors?.join(' / ') ?? '저장 실패' });
    }
  };

  return (
    <div className="admin-split">
      <div className="admin-panel">
        <h2>메인 화면 문구</h2>
        <label className="admin-field">
          윗글
          <input value={layout.eyebrow ?? ''} onChange={(e) => edit((l) => M.setHeader(l, { eyebrow: e.target.value }))} />
        </label>
        <label className="admin-field">
          제목
          <input value={layout.title} onChange={(e) => edit((l) => M.setHeader(l, { title: e.target.value }))} />
        </label>
        <label className="admin-field">
          안내 문구
          <input value={layout.lead ?? ''} onChange={(e) => edit((l) => M.setHeader(l, { lead: e.target.value }))} />
        </label>

        <h2>칸 구성</h2>
        <ol className="slot-list">
          {layout.slots.map((s, i) => (
            <SlotRow key={s.id} slot={s} index={i} count={layout.slots.length} themes={themes}
              onChange={(patch) => edit((l) => M.updateSlot(l, s.id, patch))}
              onMove={(d) => edit((l) => M.moveSlot(l, s.id, d))}
              onRemove={() => edit((l) => M.removeSlot(l, s.id))} />
          ))}
        </ol>
        <div className="admin-row">
          {Object.entries(SLOT_TYPES).map(([type, t]) => (
            <button key={type} type="button" className="admin-btn" disabled={type === 'kiosk' && !themes.length}
              onClick={() => edit((l) => M.addSlot(l, type, ctx))}>
              + {t.label}
            </button>
          ))}
        </div>

        {errors.length > 0 && <p className="admin-error" role="alert">{errors.join(' / ')}</p>}
        {msg && <p className={msg.ok ? 'admin-ok' : 'admin-error'} role="status">{msg.text}</p>}
        <div className="admin-row">
          <button type="button" className="admin-btn" disabled={!!errors.length} onClick={() => save(false)}>초안 저장</button>
          <button type="button" className="admin-btn admin-btn--primary" disabled={!!errors.length} onClick={() => save(true)}>저장하고 게시</button>
        </div>
      </div>

      <aside className="admin-preview layout-preview" aria-label="메인 화면 미리보기">
        <strong>미리보기</strong>
        <div className="layout-preview__frame">
          <HomeLayout layout={layout} onOpen={() => {}} />
        </div>
      </aside>
    </div>
  );
}
