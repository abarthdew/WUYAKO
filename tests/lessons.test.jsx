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

import threeSteps from '../src/data/lessons/three-steps.json';
import ThreeStepsLesson from '../src/lessons/threeSteps/ThreeStepsLesson.jsx';

describe('구조 학습 ② 3단계 원리', () => {
  it('설명 3장 → 문제 → 결과, 오답이면 정답을 알려 준다', () => {
    render(<ThreeStepsLesson lessonId="three-steps" content={threeSteps} onExit={() => {}} />);
    fireEvent.click(screen.getByText('다음'));
    fireEvent.click(screen.getByText('다음'));
    fireEvent.click(screen.getByText('문제 풀어 보기'));

    threeSteps.quiz.forEach((q, i) => {
      const nextLabel = i + 1 === threeSteps.quiz.length ? '결과 보기' : '다음 문제';
      expect(screen.getByText(nextLabel).closest('button').disabled).toBe(true);
      // 첫 문제만 일부러 틀린다
      const pickId = i === 0 ? threeSteps.steps.find((s) => s.id !== q.answer).id : q.answer;
      const pickName = threeSteps.steps.find((s) => s.id === pickId).name;
      fireEvent.click(screen.getByRole('button', { name: new RegExp(pickName) }));
      expect(screen.getByRole('status').textContent).toMatch(i === 0 ? /아쉬워요/ : /맞았어요/);
      fireEvent.click(screen.getByText(nextLabel));
    });
    expect(screen.getByText(`${threeSteps.quiz.length}문제 중 ${threeSteps.quiz.length - 1}개 맞혔어요!`)).toBeTruthy();
  });
});

import pictogram from '../src/data/lessons/pictogram.json';
import PictogramLesson from '../src/lessons/pictogram/PictogramLesson.jsx';
import { GLYPHS } from '../src/lessons/pictogram/glyphs.jsx';

describe('구조 학습 ③ 비슷한 버튼 찾기', () => {
  it('모든 보기가 자체 픽토그램으로 그려진다', () => {
    for (const q of pictogram.questions) {
      for (const id of q.options) expect(GLYPHS[id], id).toBeTruthy();
      for (const id of q.answers) expect(q.options).toContain(id);
    }
  });

  it('여러 개 고르기 → 확인 → 해설, 끝까지 가면 결과', () => {
    render(<PictogramLesson lessonId="pictogram" content={pictogram} onExit={() => {}} />);
    pictogram.questions.forEach((q, i) => {
      expect(screen.getByText('다 골랐어요').closest('button').disabled).toBe(true);
      // 첫 문제는 정답 하나를 빠뜨린다
      const picks = i === 0 ? q.answers.slice(1) : q.answers;
      for (const id of picks) fireEvent.click(screen.getByRole('img', { name: GLYPHS[id].label }).closest('button'));
      fireEvent.click(screen.getByText('다 골랐어요'));
      expect(screen.getByRole('status').textContent).toMatch(i === 0 ? /아쉬워요/ : /모두 맞았어요/);
      fireEvent.click(screen.getByText(i + 1 === pictogram.questions.length ? '결과 보기' : '다음 문제'));
    });
    expect(screen.getByText(`${pictogram.questions.length}문제 중 ${pictogram.questions.length - 1}개 다 맞혔어요!`)).toBeTruthy();
  });
});
