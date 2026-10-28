import { describe, expect, it } from 'vitest';
import missions from '../src/data/missions.json';
import pictogram from '../src/data/lessons/pictogram.json';
import threeSteps from '../src/data/lessons/three-steps.json';
import { overview } from '../server/read/overview.js';
import { dailySessions, trafficSources } from '../server/read/metrics/sessionMetrics.js';
import { lessonMetrics } from '../server/read/metrics/lessonMetrics.js';

const at = (iso) => new Date(iso);
const ev = (session_id, seq, type, iso, payload) => ({ session_id, seq, type, client_ts: at(iso), payload });

describe('대시보드 지표 (읽을 때 계산)', () => {
  it('일별 세션은 한국 시간 기준, 빈 날은 0', () => {
    const rows = dailySessions(
      [{ received_at: at('2026-10-26T16:00:00Z') }, { received_at: at('2026-10-27T01:00:00Z') }], // 둘 다 KST 10/27
      at('2026-10-26T00:00:00+09:00'),
      at('2026-10-28T12:00:00+09:00'),
    );
    expect(rows).toEqual([
      { day: '2026-10-26', count: 0 },
      { day: '2026-10-27', count: 2 },
      { day: '2026-10-28', count: 0 },
    ]);
  });

  it('유입 경로: UTM 원문 파싱, 없으면 직접 방문', () => {
    const rows = trafficSources([
      { entry_url: 'https://x/?utm_source=kakao&utm_campaign=home' },
      { entry_url: 'https://x/?utm_source=kakao&utm_campaign=home' },
      { entry_url: 'https://x/' },
      { entry_url: null },
    ]);
    expect(rows).toEqual([
      { source: 'kakao', campaign: 'home', count: 2 },
      { source: '직접 방문', campaign: '', count: 2 },
    ]);
  });

  it('학습 정답률: 콘텐츠 원본과 답 원물 비교', () => {
    const q = pictogram.questions[0];
    const t = threeSteps.quiz[0];
    const rows = lessonMetrics(
      [
        ev('a', 1, 'lesson_start', '2026-10-28T00:00:00Z', { lessonId: 'pictogram' }),
        ev('a', 2, 'lesson_answer', '2026-10-28T00:00:01Z', { lessonId: 'pictogram', questionId: q.id, choices: q.answers }),
        ev('a', 3, 'lesson_answer', '2026-10-28T00:00:02Z', { lessonId: 'pictogram', questionId: q.id, choices: [q.answers[0]] }),
        ev('a', 4, 'lesson_done', '2026-10-28T00:00:03Z', { lessonId: 'pictogram' }),
        ev('b', 1, 'lesson_answer', '2026-10-28T00:00:01Z', { lessonId: 'three-steps', questionId: t.id, choice: t.answer }),
        ev('c', 1, 'lesson_start', '2026-10-28T00:00:00Z', { lessonId: 'buttons' }),
      ],
      { pictogram, 'three-steps': threeSteps },
    );
    const by = Object.fromEntries(rows.map((r) => [r.lessonId, r]));
    expect(by.pictogram).toMatchObject({ starts: 1, dones: 1, completionRate: 1, accuracy: 0.5 });
    expect(by['three-steps'].accuracy).toBe(1);
    expect(by.buttons).toMatchObject({ starts: 1, completionRate: 0, accuracy: null });
  });

  it('요약: 3단계 성공률·연습 방식별 묶음·공유 클릭', () => {
    const m3 = missions['fastfood-s3'];
    const m1 = missions['fastfood-s1'];
    const events = [
      ev('a', 1, 'stage_start', '2026-10-28T00:00:00Z', { stage: 3, missionKey: 'fastfood-s3' }),
      ev('a', 2, 'order_submit', '2026-10-28T00:01:00Z', { dine: m3.dine, cart: m3.items }),
      ev('b', 1, 'stage_start', '2026-10-28T00:00:00Z', { stage: 3, missionKey: 'fastfood-s3' }),
      ev('b', 2, 'order_submit', '2026-10-28T00:02:00Z', { dine: 'in', cart: m3.items }),
      ev('c', 1, 'stage_start', '2026-10-28T00:00:00Z', { stage: 1, missionKey: 'fastfood-s1', mode: 'follow' }),
      ev('c', 2, 'order_submit', '2026-10-28T00:00:30Z', { dine: m1.dine, cart: m1.items }),
      ev('c', 3, 'share_click', '2026-10-28T00:00:40Z', { place: 'done', method: 'copy' }),
    ];
    const o = overview({
      sessions: [{ received_at: at('2026-10-28T00:00:00Z'), entry_url: 'https://x/' }],
      events,
      missions,
      lessons: {},
      from: at('2026-10-28T00:00:00Z'),
      to: at('2026-10-28T00:00:00Z'),
    });
    expect(o.kpis).toMatchObject({ sessions: 1, kioskStarts: 3, stage3SuccessRate: 0.5, stage3Submits: 2, shareClicks: 1 });
    expect(o.stagesByMode).toEqual([expect.objectContaining({ stage: 1, mode: 'follow', successes: 1 })]);
    expect(o.shares).toEqual([{ place: 'done', method: 'copy', count: 1 }]);
  });
});
