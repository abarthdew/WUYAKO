import { describe, expect, it } from 'vitest';
import missions from '../src/data/missions.json';
import { stageMetrics } from '../server/read/stageMetrics.js';

const ev = (session_id, seq, type, sec, payload) => ({ session_id, seq, type, client_ts: new Date(sec * 1000), payload });

describe('stageMetrics (읽을 때 계산)', () => {
  it('원물 이벤트로 성공률·소요 시간·가이드 이탈 탭을 계산한다', () => {
    const events = [
      ev('a', 1, 'stage_start', 0, { stage: 1, missionKey: '1' }),
      ev('a', 2, 'tap', 5, { targetId: 'cat-drink', guideTargetId: 'menu-bulgogi' }),
      ev('a', 3, 'tap', 6, { targetId: 'menu-bulgogi', guideTargetId: 'menu-bulgogi' }),
      ev('a', 4, 'order_submit', 40, { dine: 'in', cart: missions['1'].items }),
      ev('b', 1, 'stage_start', 0, { stage: 1, missionKey: '1' }),
      ev('b', 2, 'order_submit', 60, { dine: 'out', cart: missions['1'].items }),
      ev('c', 1, 'stage_start', 0, { stage: 3, missionKey: '3' }), // 제출 없이 이탈
    ];
    const m = stageMetrics(events, missions);
    expect(m['1']).toMatchObject({ starts: 2, submits: 2, successes: 1, successRate: 0.5, medianDurationMs: 50000, offGuideTaps: 1 });
    expect(m['3']).toMatchObject({ starts: 1, submits: 0, successRate: null });
  });
});
