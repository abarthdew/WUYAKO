// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { TrackingContext } from '../src/features/analytics/TrackingContext.js';
import { getStage } from '../src/features/stage/stages.js';
import { validateLayout } from '../src/features/layout/validateLayout.js';
import { resolveSlot } from '../src/home/slotTypes.jsx';
import { listVersions } from '../src/kiosk/versions/registry.js';
import PracticeRunner from '../src/practices/PracticeRunner.jsx';
import { getPractice, listPractices } from '../src/practices/registry.js';
import * as qr from '../src/practices/qrOrder/qrOrderModel.js';
import * as wl from '../src/practices/waitlist/waitlistModel.js';
import * as mv from '../src/practices/movie/movieModel.js';
import * as sc from '../src/practices/selfCheckout/selfCheckoutModel.js';
import { FLOW_TYPES } from '../src/features/flowType/flowTypes.js';

afterEach(cleanup);

const run = (m, actions) => actions.reduce(m.reduce, m.init());

describe('연습 유형', () => {
  it('모든 키오스크 버전·짧은 연습이 정의된 유형을 가진다', () => {
    const ids = FLOW_TYPES.map((t) => t.id);
    for (const x of [...listVersions(), ...listPractices()]) expect(ids).toContain(x.flowType);
  });
  it('유형마다 연습 화면이 하나 이상 있다', () => {
    const covered = new Set([...listVersions(), ...listPractices()].map((x) => x.flowType));
    expect([...covered].sort()).toEqual(FLOW_TYPES.map((t) => t.id).sort());
  });
});

describe('대기 등록 규칙', () => {
  const m = getPractice('waitlist').content.mission;
  it('인원 → 번호 순으로 가리키고, 틀린 번호는 지우게 한다', () => {
    let s = run(wl, [{ type: 'START' }]);
    expect(wl.targetOf(s, m)).toBe('wl-plus');
    s = run(wl, [{ type: 'START' }, { type: 'PLUS' }]);
    expect(wl.targetOf(s, m)).toBe('wl-next');
    s = wl.reduce({ ...s, screen: 'phone' }, { type: 'KEY', digit: '9' });
    expect(wl.targetOf(s, m)).toBe('wl-del');
  });
  it('8자리 전에는 확인으로 못 넘어간다', () => {
    const s = run(wl, [{ type: 'START' }, { type: 'TO_PHONE' }, { type: 'KEY', digit: '1' }, { type: 'TO_CHECK' }]);
    expect(s.screen).toBe('phone');
  });
  it('결과는 미션과 비교해 계산한다', () => {
    expect(wl.resultOf({ people: 3, phone: m.phone }, m).success).toBe(false);
    expect(wl.resultOf({ people: 2, phone: m.phone }, m).success).toBe(true);
  });
});

describe('QR 주문 규칙', () => {
  const m = getPractice('qr-order').content.mission;
  it('다른 메뉴를 담으면 장바구니에서 빼게 한다', () => {
    const s = run(qr, [{ type: 'OPEN_CAMERA' }, { type: 'OPEN_LINK' }, { type: 'ADD', id: 'kimbap' }]);
    expect(qr.targetOf(s, m)).toBe('qr-open-cart');
    expect(qr.targetOf(qr.reduce(s, { type: 'OPEN_CART' }), m)).toBe('qr-minus-kimbap');
  });
  it('빈 장바구니는 주문할 수 없다', () => {
    expect(qr.reduce(qr.init(), { type: 'ORDER' }).confirm).toBe(false);
  });
});

describe('영화 예매 규칙', () => {
  const m = getPractice('movie').content.mission;
  it('날짜 → 상영 → 좌석 순으로 가리키고, 미션에 없는 좌석은 풀게 한다', () => {
    expect(mv.targetOf(mv.init(), m)).toBe('mv-date-d1');
    let s = run(mv, [{ type: 'SET_DATE', id: 'd1' }]);
    expect(mv.targetOf(s, m)).toBe('mv-show-s2');
    s = run(mv, [{ type: 'SET_DATE', id: 'd1' }, { type: 'PICK_SHOW', id: 's2' }, { type: 'PLUS' }, { type: 'TO_SEAT' }, { type: 'TOGGLE_SEAT', id: 'A5' }]);
    expect(mv.targetOf(s, m)).toBe('mv-seat-A5');
  });
  it('인원보다 많이 고를 수 없고, 다 골라야 결제로 간다', () => {
    let s = run(mv, [{ type: 'PICK_SHOW', id: 's1' }, { type: 'TO_SEAT' }, { type: 'TOGGLE_SEAT', id: 'C3' }, { type: 'TOGGLE_SEAT', id: 'C4' }]);
    expect(s.seats).toEqual(['C3']);
    s = run(mv, [{ type: 'PICK_SHOW', id: 's1' }, { type: 'PLUS' }, { type: 'TO_SEAT' }, { type: 'TOGGLE_SEAT', id: 'C3' }, { type: 'TO_PAY' }]);
    expect(s.screen).toBe('seat');
  });
});

describe('셀프 계산대 규칙', () => {
  const p = getPractice('self-checkout');
  const m = p.content.mission;
  it('두 번 찍으면 빼게 하고, 다 찍으면 계산으로', () => {
    let s = run(sc, [{ type: 'START' }, { type: 'SCAN', id: 'milk' }, { type: 'SCAN', id: 'milk' }]);
    expect(sc.targetOf(s, m, p.content)).toBe('sc-remove-milk');
    s = run(sc, [{ type: 'START' }, ...p.content.basket.map((b) => ({ type: 'SCAN', id: b.id }))]);
    expect(sc.targetOf(s, m, p.content)).toBe('sc-next');
  });
  it('합계에 봉투값이 들어간다', () => {
    const s = { scanned: ['milk'], bag: 1 };
    expect(sc.totalOf(s, p.content)).toBe(2800 + p.content.bagPrice);
  });
});

// 가이드가 가리키는 곳만 눌러 끝까지 간다
const followGuide = (container) => {
  for (let i = 0; i < 40; i += 1) {
    const t = container.querySelector('.is-target');
    if (!t) return;
    fireEvent.click(t);
  }
};

describe.each(listPractices().map((p) => [p.id]))('%s 연습 화면', (id) => {
  it('1단계 가이드만 따라가면 성공, 기록은 원물만', () => {
    const events = [];
    const { container } = render(
      <TrackingContext.Provider value={(type, payload) => events.push({ type, payload })}>
        <PracticeRunner practice={getPractice(id)} stage={getStage(1)} onExit={() => {}} />
      </TrackingContext.Provider>,
    );
    fireEvent.click(screen.getByText('시작하기'));
    followGuide(container);
    expect(screen.getByText('잘하셨어요!')).toBeTruthy();
    expect(events.map((e) => e.type)).toContain('practice_done');
    expect(events.find((e) => e.type === 'practice_done').payload).not.toHaveProperty('success');
  });

  it('엉뚱한 곳을 누르면 막고 말풍선', () => {
    const { container } = render(<PracticeRunner practice={getPractice(id)} stage={getStage(1)} onExit={() => {}} />);
    fireEvent.click(screen.getByText('시작하기'));
    const wrong = [...container.querySelectorAll('.kbtn')].find((b) => !b.classList.contains('is-target'));
    if (!wrong) return;
    fireEvent.click(wrong);
    expect(screen.getByText('앗, 거기가 아니에요!')).toBeTruthy();
    expect(container.querySelector('.is-target')).toBeTruthy();
  });
});

describe('메인 화면 칸: 짧은 연습', () => {
  it('등록된 연습은 카드로, 없는 연습은 검사에서 걸린다', () => {
    expect(resolveSlot({ type: 'practice', ref: 'waitlist' }).path).toBe('/practice/waitlist');
    expect(resolveSlot({ type: 'practice', ref: 'nope' })).toBeNull();
    const layout = { title: 't', slots: [{ id: 'p1', type: 'practice', ref: 'nope' }] };
    expect(validateLayout(layout, { lessons: [], versions: [], practices: ['waitlist'] })).toEqual(['1번 칸: 없는 연습 nope']);
  });
});
