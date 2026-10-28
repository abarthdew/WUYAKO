import { useEffect, useState } from 'react';
import { validateTheme } from '../../features/theme/validateTheme.js';
import { adminApi } from '../adminApi.js';
import MenuItemRow from './MenuItemRow.jsx';
import ThemePreview from './ThemePreview.jsx';
import * as M from './themeModel.js';

// 업종 테마 편집: 목록 → 편집 → 저장(초안) / 게시
export default function ThemeEditor() {
  const [list, setList] = useState([]);
  const [slug, setSlug] = useState(null);
  const [doc, setDoc] = useState(null); // { revision_id, published_revision_id }
  const [theme, setTheme] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState(null);

  const loadList = () => adminApi.listDocuments('theme').then(setList);
  useEffect(() => {
    loadList();
  }, []);

  const open = async (s) => {
    const d = await adminApi.getDocument('theme', s);
    setSlug(s);
    setDoc(d);
    setTheme(d.body);
    setDirty(false);
    setMsg(null);
  };

  const edit = (fn) => {
    setTheme((t) => fn(t));
    setDirty(true);
    setMsg(null);
  };

  const errors = theme ? validateTheme(theme) : [];

  const save = async (publish) => {
    try {
      const r = await adminApi.saveDocument('theme', slug, { ...theme, id: slug }, publish);
      setMsg({ ok: true, text: publish ? '저장하고 게시했어요. 키오스크에 바로 반영돼요.' : '초안으로 저장했어요 (아직 게시 전).' });
      setDirty(false);
      setDoc((d) => ({ ...d, revision_id: r.revisionId, published_revision_id: publish ? r.revisionId : d.published_revision_id }));
      loadList();
    } catch (err) {
      setMsg({ ok: false, text: err.data?.errors?.join(' / ') ?? '저장 실패' });
    }
  };

  const createCopy = () => {
    const newSlug = window.prompt('새 테마 주소 이름 (영문 소문자·숫자·-) 예: cafe');
    if (!newSlug) return;
    if (!/^[a-z0-9][a-z0-9-]*$/.test(newSlug) || list.some((d) => d.slug === newSlug)) {
      setMsg({ ok: false, text: '쓸 수 없는 이름이에요 (형식 또는 중복).' });
      return;
    }
    const storeName = window.prompt('가게 이름', '새 가게') ?? '새 가게';
    setSlug(newSlug);
    setDoc({ revision_id: null, published_revision_id: null });
    setTheme(M.copyTheme(theme, newSlug, storeName));
    setDirty(true);
    setMsg({ ok: true, text: '지금 보던 테마를 복사했어요. 고친 뒤 저장하세요.' });
  };

  return (
    <div className="admin-split">
      <div className="admin-panel">
        <div className="admin-row">
          <label className="admin-field">
            테마
            <select value={slug ?? ''} onChange={(e) => e.target.value && open(e.target.value)}>
              <option value="">고르세요</option>
              {list.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.slug} {d.published_revision_id ? (d.published_revision_id === d.latest_revision_id ? '· 게시됨' : '· 초안 있음') : '· 미게시'}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="admin-btn" disabled={!theme} onClick={createCopy}>복사해서 새 테마</button>
        </div>

        {theme && (
          <>
            <p className="admin-row">
              상태: {doc?.published_revision_id && doc.published_revision_id === doc.revision_id && !dirty ? '게시된 버전' : '게시 전 변경 있음'}
            </p>
            <label className="admin-field">
              가게 이름
              <input value={theme.storeName} onChange={(e) => edit((t) => M.setStoreName(t, e.target.value))} />
            </label>

            <section className="admin-panel">
              <h2>메뉴 종류</h2>
              <table className="admin-table">
                <thead><tr><th>진짜 이름</th><th>쉬운 말</th><th /></tr></thead>
                <tbody>
                  {theme.categories.map((c) => (
                    <tr key={c.id}>
                      <td><input aria-label="종류 이름" value={c.real} onChange={(e) => edit((t) => M.updateCategory(t, c.id, { real: e.target.value }))} /></td>
                      <td><input aria-label="쉬운 말" value={c.easy} onChange={(e) => edit((t) => M.updateCategory(t, c.id, { easy: e.target.value }))} /></td>
                      <td><button type="button" className="admin-btn admin-btn--small" onClick={() => edit((t) => M.removeCategory(t, c.id))}>삭제</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="button" className="admin-btn" onClick={() => edit(M.addCategory)}>종류 추가</button>
            </section>

            <section className="admin-panel">
              <h2>메뉴</h2>
              <table className="admin-table">
                <thead><tr><th>그림</th><th>이름</th><th>가격</th><th>종류</th><th>이모지</th><th>세트</th><th /></tr></thead>
                <tbody>
                  {theme.menu.map((m) => (
                    <MenuItemRow key={m.id} item={m} categories={theme.categories}
                      onChange={(patch) => edit((t) => M.updateItem(t, m.id, patch))}
                      onRemove={() => edit((t) => M.removeItem(t, m.id))} />
                  ))}
                </tbody>
              </table>
              <button type="button" className="admin-btn" onClick={() => edit((t) => M.addItem(t))}>메뉴 추가</button>
            </section>

            {theme.setOption && (
              <section className="admin-panel">
                <h2>세트 옵션</h2>
                <label className="admin-field">
                  세트 추가금
                  <input type="number" min="0" step="100" value={theme.setOption.extraPrice}
                    onChange={(e) => edit((t) => M.updateSetOption(t, { extraPrice: Number.parseInt(e.target.value || '0', 10) }))} />
                </label>
                <table className="admin-table">
                  <thead><tr><th>세트 음료</th><th>추가금</th></tr></thead>
                  <tbody>
                    {theme.setOption.drinks.map((d) => (
                      <tr key={d.id}>
                        <td><input aria-label="음료 이름" value={d.name} onChange={(e) => edit((t) => M.updateDrink(t, d.id, { name: e.target.value }))} /></td>
                        <td><input className="num" aria-label="음료 추가금" type="number" min="0" step="100" value={d.extraPrice}
                          onChange={(e) => edit((t) => M.updateDrink(t, d.id, { extraPrice: Number.parseInt(e.target.value || '0', 10) }))} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {errors.length > 0 && <p className="admin-error" role="alert">{errors.join(' / ')}</p>}
            {msg && <p className={msg.ok ? 'admin-ok' : 'admin-error'} role="status">{msg.text}</p>}
            <div className="admin-row">
              <button type="button" className="admin-btn" disabled={!!errors.length} onClick={() => save(false)}>초안 저장</button>
              <button type="button" className="admin-btn admin-btn--primary" disabled={!!errors.length} onClick={() => save(true)}>저장하고 게시</button>
            </div>
          </>
        )}
      </div>
      {theme && !errors.length && <ThemePreview theme={theme} />}
    </div>
  );
}
