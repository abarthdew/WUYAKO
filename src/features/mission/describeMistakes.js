// checkMission 결과 → 결과 화면에 보여 줄 틀린 부분 문장 목록 (화면 표시용, 저장하지 않음)
const DINE = { in: '매장 식사', out: '포장' };

// 받침 있으면 '을', 없으면 '를'
const eulReul = (word) => {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  return code >= 0 && code < 11172 && code % 28 !== 0 ? '을' : '를';
};

export const describeMistakes = (result, mission, nameOf) => {
  const list = [];
  if (!result.dineOk) {
    const chosen = DINE[result.dine] ?? '선택 안 함';
    list.push({ key: 'dine', text: `먹는 곳: '${DINE[mission.dine]}'인데 '${chosen}'${eulReul(chosen)} 골랐어요` });
  }
  for (const i of result.items) {
    if (i.want === i.got) continue;
    const name = nameOf(i.key);
    if (i.got === 0) list.push({ key: i.key, text: `빠졌어요: ${name} ${i.want}개` });
    else if (i.want === 0) list.push({ key: i.key, text: `미션에 없어요: ${name} ${i.got}개를 담았어요` });
    else list.push({ key: i.key, text: `개수가 달라요: ${name} ${i.want}개인데 ${i.got}개를 담았어요` });
  }
  return list;
};
