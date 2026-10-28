// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import theme from '../src/data/fastfood.json';
import missions from '../src/data/missions.json';
import KioskRunner from '../src/kiosk/KioskRunner.jsx';
import { getVersion } from '../src/kiosk/versions/registry.js';

afterEach(cleanup);

// 메뉴 화면까지 가이드대로 이동
const toMenu = (versionId, mission, mode = '도움이 필요해요') => {
  const r = render(<KioskRunner version={getVersion(versionId)} theme={theme} mission={mission} missionKey="t" onExit={() => {}} />);
  fireEvent.click(screen.getByText(mode));
  fireEvent.click(screen.getByText('시작하기'));
  fireEvent.click(r.container.querySelector('.is-target')); // 터치
  fireEvent.click(r.container.querySelector('.is-target')); // 매장/포장
  return r;
};
const bubble = () => screen.queryByRole('alertdialog', { name: '안내' });

describe('말풍선 가이드 (1·2단계, 도움이 필요해요)', () => {
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

describe('연습 방식 선택', () => {
  it('3단계·자유 주문에는 선택 화면이 없다', () => {
    render(<KioskRunner version={getVersion('stage3-v1')} theme={theme} mission={missions['fastfood-s3']} onExit={() => {}} />);
    expect(screen.queryByText('따라서 해볼래요')).toBeNull();
    cleanup();
    render(<KioskRunner version={getVersion('stage1-v1')} theme={theme} mission={null} onExit={() => {}} />);
    expect(screen.queryByText('따라서 해볼래요')).toBeNull();
  });

  it('따라서 해볼래요: 엉뚱한 곳을 눌러도 진행되고, 결과에서 틀린 곳을 강조', () => {
    const { container } = toMenu('stage1-v1', missions['fastfood-s1'], '따라서 해볼래요');
    fireEvent.click(screen.getByText('치킨버거')); // 미션은 불고기버거
    expect(bubble()).toBeNull();
    fireEvent.click(screen.getByText('햄버거만')); // 단품
    fireEvent.click(screen.getByText('담기'));
    // 이후는 가이드 대상만 누르되, 미션 메뉴는 이미 틀렸으므로 장바구니로 바로 이동
    fireEvent.click(screen.getByText('고른 것 보기'));
    fireEvent.click(screen.getByText('돈 내기'));
    fireEvent.click(screen.getByText('카드로 내기'));
    fireEvent.click(container.querySelector('.pay__insert'));
    const mistakes = screen.getByRole('region', { name: '틀린 곳' }).textContent;
    expect(mistakes).toMatch(/빠졌어요: 불고기버거 세트 \(사이다\) 1개/);
    expect(mistakes).toMatch(/미션에 없어요: 치킨버거 1개/);
    expect(container.querySelector('.done__offguide').textContent).toMatch(/[1-9]번 눌렀어요/);
  });

  it('한 번 더를 누르면 선택 화면부터', () => {
    const { container } = toMenu('stage1-v1', missions['fastfood-s1']);
    for (let i = 0; i < 30 && container.querySelector('.is-target'); i += 1) fireEvent.click(container.querySelector('.is-target'));
    fireEvent.click(screen.getByText('한 번 더'));
    expect(screen.getByText('어떻게 연습할까요?')).toBeTruthy();
  });
});
