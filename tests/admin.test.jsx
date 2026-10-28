// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fastfood from '../src/data/fastfood.json';
import AdminPage from '../src/admin/AdminPage.jsx';
import { setToken } from '../src/admin/adminApi.js';

// 관리자 API 가짜 서버
const mockApi = (routes) => {
  const calls = [];
  vi.stubGlobal('fetch', vi.fn(async (url, init = {}) => {
    calls.push({ url, method: init.method ?? 'GET', body: init.body });
    const hit = routes.find(([m, re]) => (init.method ?? 'GET') === m && re.test(url));
    const data = hit ? hit[2](init) : { error: 'not_found' };
    return new Response(JSON.stringify(data), { status: hit ? 200 : 404, headers: { 'content-type': 'application/json' } });
  }));
  return calls;
};

beforeEach(() => setToken('t'));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  setToken('');
});

describe('관리자 · 업종 테마', () => {
  it('테마를 열어 고치고 게시하면 저장 API가 호출된다', async () => {
    const calls = mockApi([
      ['GET', /\/admin\/session$/, () => ({ ok: true })],
      ['GET', /\/admin\/documents\/theme$/, () => [{ slug: 'fastfood', latest_revision_id: 'r1', published_revision_id: 'r1' }]],
      ['GET', /\/admin\/documents\/theme\/fastfood$/, () => ({ revision_id: 'r1', published_revision_id: 'r1', body: fastfood, revisions: [] })],
      ['POST', /\/admin\/documents\/theme\/fastfood$/, () => ({ revisionId: 'r2', published: true })],
    ]);
    render(<AdminPage tool="theme" />);
    const select = await screen.findByRole('combobox', { name: '테마' });
    await screen.findByRole('option', { name: /fastfood/ });
    fireEvent.change(select, { target: { value: 'fastfood' } });

    const store = await screen.findByDisplayValue(fastfood.storeName);
    fireEvent.change(store, { target: { value: '우야꼬 버거 2호점' } });
    expect(screen.getByText('미리보기')).toBeTruthy();
    fireEvent.click(screen.getByText('시작하기')); // 미리보기 안에서 조작
    fireEvent.click(screen.getByText('주문하시려면 화면을 터치하세요'));

    fireEvent.click(screen.getByText('저장하고 게시'));
    await waitFor(() => expect(screen.getByRole('status').textContent).toMatch(/게시했어요/));
    expect(calls.some((c) => /\/track\//.test(c.url))).toBe(false); // 미리보기는 기록하지 않음
    const post = calls.find((c) => c.method === 'POST' && /\/admin\/documents/.test(c.url));
    expect(JSON.parse(post.body)).toMatchObject({ publish: true, body: { id: 'fastfood', storeName: '우야꼬 버거 2호점' } });
  });

  it('토큰이 틀리면 로그인 화면', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 401 })));
    render(<AdminPage tool="theme" />);
    expect(await screen.findByText('관리자 키')).toBeTruthy();
  });
});
