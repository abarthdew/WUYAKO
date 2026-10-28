// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import buttons from '../src/data/lessons/buttons.json';
import ButtonsLesson from '../src/lessons/buttons/ButtonsLesson.jsx';
import { DEMOS } from '../src/lessons/buttons/demos/index.js';

afterEach(cleanup);

// 체험별 성공 동작
const ACT = {
  'open-menu': () => fireEvent.click(screen.getByLabelText('메뉴 열기')),
  back: () => fireEvent.click(screen.getByLabelText('뒤로 가기')),
  'close-popup': () => fireEvent.click(screen.getByLabelText('닫기')),
  badge: () => {
    fireEvent.click(screen.getByText('🍔 담기'));
    fireEvent.click(screen.getByText('🍔 담기'));
  },
  tabs: () => fireEvent.click(screen.getByRole('tab', { name: '음료' })),
  swipe: () => {
    const area = screen.getByTestId('swipe-area');
    fireEvent.pointerDown(area, { clientX: 200 });
    fireEvent.pointerUp(area, { clientX: 60 });
  },
  disabled: () => {
    const pay = screen.getByText('결제하기');
    fireEvent.click(pay); // 회색일 땐 안 눌림
    expect(screen.getByText('다음 버튼').closest('button').disabled).toBe(true);
    fireEvent.click(screen.getByText('🍔 고르기'));
    fireEvent.click(pay);
  },
  tap: () => fireEvent.click(screen.getByLabelText('처음으로')),
};

describe('구조 학습 ① 버튼 모양', () => {
  it('모든 체험 종류가 콘텐츠에 대응한다', () => {
    for (const item of buttons.items) expect(DEMOS[item.demo]).toBeTruthy();
  });

  it('직접 해 봐야 다음으로 넘어가고, 끝까지 가면 완료', () => {
    render(<ButtonsLesson lessonId="buttons" content={buttons} onExit={() => {}} />);
    buttons.items.forEach((item, i) => {
      const nextLabel = i + 1 === buttons.items.length ? '다 했어요' : '다음 버튼';
      expect(screen.getByText(nextLabel).closest('button').disabled).toBe(true);
      ACT[item.demo]();
      expect(screen.getByText('잘하셨어요! 👏')).toBeTruthy();
      fireEvent.click(screen.getByText(nextLabel));
    });
    expect(screen.getByText('버튼 박사가 됐어요!')).toBeTruthy();
  });
});
