// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import theme from '../src/data/fastfood.json';
import missions from '../src/data/missions.json';
import KioskRunner from '../src/kiosk/KioskRunner.jsx';
import { getVersion } from '../src/kiosk/versions/registry.js';

afterEach(cleanup);

// 메뉴 화면까지 가이드대로 이동
const toMenu = (versionId, mission) => {
  const r = render(<KioskRunner version={getVersion(versionId)} theme={theme} mission={mission} missionKey="t" onExit={() => {}} />);
  fireEvent.click(screen.getByText('시작하기'));
  fireEvent.click(r.container.querySelector('.is-target')); // 터치
  fireEvent.click(r.container.querySelector('.is-target')); // 매장/포장
  return r;
};
const bubble = () => screen.queryByRole('alertdialog', { name: '안내' });

describe('말풍선 가이드 (1·2단계)', () => {
  it('엉뚱한 버튼: 동작하지 않고 누를 곳을 말풍선으로 안내, 닫기로 닫힘', () => {
    toMenu('stage1-v1', missions['fastfood-s1']);
    fireEvent.click(screen.getByText('치킨버거'));
    expect(screen.queryByRole('dialog')).toBeNull(); // 옵션 팝업 안 열림
    expect(bubble().textContent).toMatch(/불고기버거/);
    fireEvent.click(screen.getByRole('button', { name: '닫기' }));
    expect(bubble()).toBeNull();
  });

  it('빈 곳을 눌러도 안내, 올바른 곳을 누르면 자동으로 닫힘', () => {
    const { container } = toMenu('stage2-v1', missions['fastfood-s2']);
    fireEvent.click(container.querySelector('.menu__grid'));
    expect(bubble()).toBeTruthy();
    fireEvent.click(container.querySelector('.is-target'));
    expect(bubble()).toBeNull();
  });

  it('탈출 버튼(처음으로)은 가이드 중에도 동작', () => {
    toMenu('stage1-v1', missions['fastfood-s1']);
    fireEvent.click(screen.getByText('처음부터'));
    expect(screen.getByText('주문하시려면 화면을 터치하세요')).toBeTruthy();
    expect(bubble()).toBeNull();
  });

  it('3단계는 말풍선 없이 누른 대로 동작', () => {
    render(<KioskRunner version={getVersion('stage3-v1')} theme={theme} mission={missions['fastfood-s3']} missionKey="t" onExit={() => {}} />);
    fireEvent.click(screen.getByText('시작하기'));
    fireEvent.click(screen.getByText('주문하시려면 화면을 터치하세요'));
    fireEvent.click(screen.getByText('매장 식사')); // 미션은 포장이지만 그대로 진행
    expect(bubble()).toBeNull();
    expect(screen.getByText('치킨버거')).toBeTruthy();
  });
});
