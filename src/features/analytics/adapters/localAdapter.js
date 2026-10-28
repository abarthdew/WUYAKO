const KEY = 'wuyako.events';

// 브라우저 안에만 쌓인다. 실제 지표 집계는 서버 어댑터로 교체 후 가능.
export const localAdapter = {
  send(event) {
    try {
      const list = JSON.parse(localStorage.getItem(KEY) ?? '[]');
      list.push(event);
      localStorage.setItem(KEY, JSON.stringify(list.slice(-500)));
    } catch {
      // 저장 불가(사생활 보호 모드 등) 시 무시
    }
  },
};
