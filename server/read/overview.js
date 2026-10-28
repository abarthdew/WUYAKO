import { dailySessions, trafficSources } from './metrics/sessionMetrics.js';
import { lessonMetrics } from './metrics/lessonMetrics.js';
import { shareMetrics } from './metrics/shareMetrics.js';
import { stageMetrics } from './stageMetrics.js';

const toRows = (obj, extra = (k) => ({ key: k })) => Object.entries(obj).map(([k, v]) => ({ ...extra(k), ...v }));

// 대시보드 한 번에 필요한 지표. 모두 원물에서 읽을 때 계산한다.
// 새 지표: metrics/에 순수 함수 추가 → 여기 한 줄 → 화면 위젯 하나
export const overview = ({ sessions, events, missions, lessons, from, to }) => {
  const stages = stageMetrics(events, missions);
  const byMode = stageMetrics(
    events.filter((e) => e.type !== 'stage_start' || e.payload.mode),
    missions,
    (p) => `${p.stage}|${p.mode}`,
  );
  const shares = shareMetrics(events);
  return {
    range: { from, to },
    kpis: {
      sessions: sessions.length,
      kioskStarts: Object.values(stages).reduce((n, s) => n + s.starts, 0),
      stage3SuccessRate: stages[3]?.successRate ?? null,
      stage3Submits: stages[3]?.submits ?? 0,
      shareClicks: shares.reduce((n, s) => n + s.count, 0),
    },
    daily: dailySessions(sessions, from, to),
    stages: toRows(stages, (k) => ({ stage: Number(k) })),
    stagesByMode: toRows(byMode, (k) => {
      const [stage, mode] = k.split('|');
      return { stage: Number(stage), mode };
    }),
    lessons: lessonMetrics(events, lessons),
    sources: trafficSources(sessions),
    shares,
  };
};
