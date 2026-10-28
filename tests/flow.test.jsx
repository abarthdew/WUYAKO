// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../src/app/App.jsx';

afterEach(cleanup);

describe('1단계 흐름', () => {
  it('가이드가 가리키는 곳만 누르면 미션에 성공한다', () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByText('1단계 · 따라 하기'));
    fireEvent.click(screen.getByText('시작하기'));
    for (let i = 0; i < 20; i += 1) {
      const target = container.querySelector('.is-target');
      if (!target) break;
      expect(container.querySelectorAll('.is-target')).toHaveLength(1);
      fireEvent.click(target);
    }
    expect(screen.getByText('잘하셨어요!')).toBeTruthy();
  });
});

describe('3단계 흐름', () => {
  it('가이드가 없다', () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByText('3단계 · 혼자 하기'));
    fireEvent.click(screen.getByText('시작하기'));
    expect(container.querySelector('.is-target')).toBeNull();
    expect(container.querySelector('.kiosk[data-stage="3"]')).toBeTruthy();
  });
});
