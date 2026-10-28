const sameSet = (a, b) => a.length === b.length && a.every((x) => b.includes(x));

// 학습별 정답 판정: 콘텐츠 원본과 답 원물을 비교 (새 학습은 여기에 한 줄 추가)
const CHECKERS = {
  'three-steps': (content, p) => content.quiz?.find((q) => q.id === p.questionId)?.answer === p.choice,
  pictogram: (content, p) => {
    const q = content.questions?.find((x) => x.id === p.questionId);
    return !!q && sameSet(p.choices ?? [], q.answers);
  },
};

// 원물 이벤트 → 학습 모듈별 시작·완료·정답률. lessons: { [lessonId]: contentBody }
export const lessonMetrics = (events, lessons) => {
  const stats = {};
  const row = (id) => (stats[id] ??= { starts: 0, dones: 0, answers: 0, correct: 0 });
  for (const e of events) {
    const id = e.payload?.lessonId;
    if (!id) continue;
    if (e.type === 'lesson_start') row(id).starts += 1;
    if (e.type === 'lesson_done') row(id).dones += 1;
    if (e.type === 'lesson_answer') {
      const r = row(id);
      r.answers += 1;
      const check = CHECKERS[id];
      if (check && lessons[id] && check(lessons[id], e.payload)) r.correct += 1;
    }
  }
  return Object.entries(stats).map(([lessonId, s]) => ({
    lessonId,
    ...s,
    completionRate: s.starts ? s.dones / s.starts : null,
    accuracy: s.answers && CHECKERS[lessonId] ? s.correct / s.answers : null,
  }));
};
