// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import home from '../src/data/layouts/home.json';
import fastfood from '../src/data/fastfood.json';
import { validateLayout } from '../src/features/layout/validateLayout.js';
import HomeLayout from '../src/home/HomeLayout.jsx';
import * as M from '../src/admin/layout/layoutModel.js';
import AdminPage from '../src/admin/AdminPage.jsx';
import { setToken } from '../src/admin/adminApi.js';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  setToken('');
});

const ctx = { lessons: ['buttons', 'three-steps', 'pictogram'], versions: ['stage1-v1', 'stage2-v1', 'stage3-v1'], themes: ['fastfood'] };

describe('메인 화면 구성', () => {
  it('기본 구성은 검사 통과', () => {
    expect(validateLayout(home, ctx)).toEqual([]);
  });

  it('칸 추가·이동·숨기기·삭제', () => {
    let l = M.addSlot(home, 'kiosk', ctx);
    const added = l.slots.at(-1);
    expect(added).toMatchObject({ type: 'kiosk', ref: 'stage1-v1', theme: 'fastfood', visible: true });
    l = M.moveSlot(l, added.id, -1);
    expect(l.slots.at(-2).id).toBe(added.id);
    l = M.updateSlot(l, added.id, { visible: false });
    expect(l.slots.find((s) => s.id === added.id).visible).toBe(false);
    expect(M.removeSlot(l, added.id).slots).toHaveLength(home.slots.length);
    expect(M.moveSlot(home, home.slots[0].id, -1)).toBe(home); // 맨 위는 그대로
  });

  it('검사: 없는 참조·빈 제목·중복 id', () => {
    const bad = { ...home, title: '', slots: [...home.slots, { id: 'l1', type: 'lesson', ref: 'nope' }] };
    const errs = validateLayout(bad, ctx);
    expect(errs.join()).toMatch(/제목/);
    expect(errs.join()).toMatch(/중복/);
    expect(errs.join()).toMatch(/없는 학습/);
  });

  it('렌더링: 순서대로, 숨긴 칸·없는 참조는 빠진다', () => {
    const layout = {
      title: 'T',
      slots: [
        { id: 'a', type: 'kiosk', ref: 'stage3-v1', theme: 'fastfood' },
        { id: 'b', type: 'lesson', ref: 'buttons', visible: false },
        { id: 'c', type: 'lesson', ref: 'pictogram' },
        { id: 'd', type: 'lesson', ref: 'nope' },
      ],
    };
    const onOpen = vi.fn();
    render(<HomeLayout layout={layout} onOpen={onOpen} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.map((b) => b.textContent)).toEqual([expect.stringMatching(/3단계/), expect.stringMatching(/비슷한 버튼/)]);
    fireEvent.click(buttons[0]);
    expect(onOpen).toHaveBeenCalledWith('/kiosk/stage3-v1?theme=fastfood');
  });
});

describe('관리자 · 메인 화면', () => {
  it('칸 순서를 바꾸면 미리보기에 반영되고, 게시하면 저장 API 호출', async () => {
    setToken('t');
    const calls = [];
    vi.stubGlobal('fetch', vi.fn(async (url, init = {}) => {
      const method = init.method ?? 'GET';
      calls.push({ url, method, body: init.body });
      const ok = (d) => new Response(JSON.stringify(d), { status: 200 });
      if (/\/admin\/session$/.test(url)) return ok({ ok: true });
      if (/\/admin\/documents\/layout\/home$/.test(url) && method === 'GET') return ok({ revision_id: 'r1', body: home, revisions: [] });
      if (/\/content\/theme$/.test(url)) return ok([{ slug: 'fastfood', body: fastfood }]);
      if (/\/admin\/documents\/layout\/home$/.test(url)) return ok({ revisionId: 'r2', published: true });
      return new Response('{}', { status: 404 });
    }));
    render(<AdminPage tool="layout" />);
    const preview = await screen.findByLabelText('메인 화면 미리보기');
    const firstCard = () => within(preview).getAllByRole('button')[0].textContent;
    expect(firstCard()).toMatch(/버튼 모양/);

    fireEvent.click(await screen.findByLabelText('2번 아래로')); // buttons ↔ three-steps
    expect(firstCard()).toMatch(/3단계 원리/);

    fireEvent.click(screen.getByText('저장하고 게시'));
    await waitFor(() => expect(screen.getByRole('status').textContent).toMatch(/게시했어요/));
    const post = calls.find((c) => c.method === 'POST');
    expect(JSON.parse(post.body).body.slots[1].ref).toBe('three-steps');
  });
});
