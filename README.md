# 우야꼬 (WUYAKO)

> 키오스크 외우지 마세요, 읽는 법을 배우세요.

노년층이 처음 보는 키오스크도 스스로 다룰 수 있도록 화면의 구조와 원리를 가르치는 학습 웹 서비스.

- Epic: [ABTHDW-46](https://sugar-coat-code.atlassian.net/browse/ABTHDW-46)
- 2019 시안: [abarthdew/wuyako-for-semi](https://github.com/abarthdew/wuyako-for-semi)

## 실행

```bash
npm install
npm run dev     # 개발 서버
npm test        # 단위·흐름 테스트
npm run build   # dist/ 정적 빌드
```

## 구조

```
src/
  app/          App, 세션 reducer(화면 흐름), StageContext
  screens/      화면 단위 (Home, Mission, Idle, Dine, Menu, Cart, Payment, Done + 팝업)
  components/   공용 UI (KioskButton, Term, Badge, Popup, KioskFrame ...)
  features/
    stage/      단계 설정(stages.js) — 1단계·3단계 차이는 여기서만 정의
    guide/      가이드 대상 계산(guideTarget.js), 손가락 애니메이션
    mission/    미션 카드, 정답 비교(checkMission.js)
    cart/       장바구니 순수 함수
    analytics/  이벤트 기록 — 어댑터 교체로 저장소 변경
    speech/     음성 안내 (Web Speech API)
  data/         업종 데이터(fastfood.json), 미션(missions.json)
  styles/       디자인 토큰, 기본 스타일
tests/          vitest (순수 함수 + jsdom 흐름 테스트)
```

## 규칙

- 컴포넌트마다 `.jsx` + `.css` 분리, import로 연결.
- 로직은 순수 함수(`features/*/*.js`)로 분리하고 화면은 표시만 담당.
- 업종 확장: `data/`에 JSON 추가 + 미션 정의. 화면 코드는 재사용.
