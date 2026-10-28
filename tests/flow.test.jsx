// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import theme from '../src/data/fastfood.json';
import missions from '../src/data/missions.json';
import App from '../src/app/App.jsx';
import KioskRunner from '../src/kiosk/KioskRunner.jsx';
import { getVersion, listVersions } from '../src/kiosk/versions/registry.js';

afterEach(() => {
  cleanup();
  window.location.hash = '';
});

const run = (versionId, mission) =>
  render(<KioskRunner version={getVersion(versionId)} theme={theme} mission={mission} missionKey="t" onExit={() => {}} />);

// 가이드 대상만 계속 누른다
const followGuide = (container) => {
  for (let i = 0; i < 30; i += 1) {
    const targets = container.querySelectorAll('.is-target');
    if (!targets.length) return;
    expect(targets).toHaveLength(1);
    fireEvent.click(targets[0]);
  }
};

describe('키오스크 버전', () => {
  it('1·2·3단계 v1이 등록돼 있다', () => {
    expect(listVersions().map((v) => v.id)).toEqual(['stage1-v1', 'stage2-v1', 'stage3-v1']);
  });

  it('1단계: 손가락 가이드만 따라가면 미션 성공', () => {
    const { container } = run('stage1-v1', missions['fastfood-s1']);
    fireEvent.click(screen.getByText('시작하기'));
    expect(container.querySelector('.guide-hand')).toBeTruthy();
    followGuide(container);
    expect(screen.getByText('잘하셨어요!')).toBeTruthy();
  });

  it('2단계: 손가락 없이 윤곽 가이드만, 따라가면 성공', () => {
    const { container } = run('stage2-v1', missions['fastfood-s2']);
    fireEvent.click(screen.getByText('시작하기'));
    expect(container.querySelector('.kiosk[data-stage="2"]')).toBeTruthy();
    expect(container.querySelector('.guide-hand')).toBeNull();
    expect(container.querySelector('.is-target')).toBeTruthy();
    followGuide(container);
    expect(screen.getByText('잘하셨어요!')).toBeTruthy();
  });

  it('3단계: 가이드 없음', () => {
    const { container } = run('stage3-v1', missions['fastfood-s3']);
    fireEvent.click(screen.getByText('시작하기'));
    expect(container.querySelector('.is-target')).toBeNull();
    expect(container.querySelector('.kiosk[data-stage="3"]')).toBeTruthy();
  });

  it('미션이 없으면 자유 주문 모드', () => {
    const { container } = run('stage1-v1', null);
    fireEvent.click(screen.getByText('시작하기'));
    expect(container.querySelector('.is-target')).toBeNull();
  });
});

describe('App 라우팅', () => {
  it('홈 → 키오스크 (서버 없으면 번들 콘텐츠 사용)', async () => {
    render(<App />);
    fireEvent.click(await screen.findByText('2단계 · 살짝 도움 받기'));
    expect(await screen.findByText(/새우버거 세트/)).toBeTruthy();
  });
});

describe('문서 전환', () => {
  it('학습을 바꿔 이동해도 이전 학습 내용으로 그리지 않는다', async () => {
    window.location.hash = '#/lesson/buttons';
    render(<App />);
    await screen.findByText('직접 해 보세요');
    window.location.hash = '#/lesson/three-steps';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(await screen.findByText('기본 원리는 3단계만 기억하세요!')).toBeTruthy();
  });
});
