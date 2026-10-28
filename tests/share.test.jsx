// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ShareButton from '../src/components/ShareButton.jsx';
import { shareLink, shareUrl } from '../src/features/share/share.js';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  delete window.Kakao;
  delete navigator.share;
});

describe('카톡 공유', () => {
  it('공유 링크에 유입 경로(UTM)가 붙는다', () => {
    const url = new URL(shareUrl('home'));
    expect(url.searchParams.get('utm_source')).toBe('kakao');
    expect(url.searchParams.get('utm_campaign')).toBe('home');
  });

  it('카카오 키가 있으면 카카오 공유', async () => {
    const sendDefault = vi.fn();
    window.Kakao = { isInitialized: () => true, init: vi.fn(), Share: { sendDefault } };
    expect(await shareLink({ place: 'home', text: 't', kakaoKey: 'k' })).toBe('kakao');
    expect(sendDefault.mock.calls[0][0]).toMatchObject({ objectType: 'text', text: 't' });
  });

  it('키가 없으면 휴대폰 공유창', async () => {
    navigator.share = vi.fn(async () => {});
    expect(await shareLink({ place: 'home', text: 't', kakaoKey: '' })).toBe('webshare');
  });

  it('공유창도 없으면 링크 복사 + 안내', async () => {
    const writeText = vi.fn(async () => {});
    vi.stubGlobal('navigator', { ...navigator, share: undefined, clipboard: { writeText } });
    render(<ShareButton place="done" label="카톡으로 자랑하기" text="자랑" />);
    fireEvent.click(screen.getByText('카톡으로 자랑하기'));
    expect(await screen.findByRole('status')).toHaveProperty('textContent', expect.stringMatching(/복사했어요/));
    expect(writeText.mock.calls[0][0]).toMatch(/^자랑\nhttp/);
  });
});
