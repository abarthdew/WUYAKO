const KEY = 'wuyako.events';

// 브라우저 안에만 쌓인다. 서버 없이 개발할 때용.
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
