import { checkMission } from '../../src/features/mission/checkMission.js';

// 원물 이벤트 → 단계별 지표. DB에는 계산값을 저장하지 않고 여기서 만든다.
// missions: { [missionKey]: missionBody }
export const stageMetrics = (events, missions) => {
  const bySession = Map.groupBy(events, (e) => e.session_id);
  const stats = {};
  for (const list of bySession.values()) {
    let run = null;
    for (const e of list) {
      if (e.type === 'stage_start') {
        run = { stage: e.payload.stage, missionKey: e.payload.missionKey, startedAt: new Date(e.client_ts), taps: 0, guided: 0 };
        const s = (stats[run.stage] ??= { starts: 0, submits: 0, successes: 0, durationsMs: [], offGuideTaps: 0 });
        s.starts += 1;
      } else if (run && e.type === 'tap') {
        run.taps += 1;
        if (e.payload.guideTargetId && e.payload.targetId !== e.payload.guideTargetId) stats[run.stage].offGuideTaps += 1;
      } else if (run && e.type === 'order_submit') {
        const s = stats[run.stage];
        const mission = missions[run.missionKey];
        s.submits += 1;
        if (mission && checkMission(mission, e.payload).success) s.successes += 1;
        s.durationsMs.push(new Date(e.client_ts) - run.startedAt);
        run = null;
      }
    }
  }
  return Object.fromEntries(
    Object.entries(stats).map(([stage, s]) => [
      stage,
      {
        starts: s.starts,
        submits: s.submits,
        successes: s.successes,
        successRate: s.submits ? s.successes / s.submits : null,
        medianDurationMs: median(s.durationsMs),
        offGuideTaps: s.offGuideTaps,
      },
    ]),
  );
};

const median = (xs) => {
  if (!xs.length) return null;
  const sorted = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};
