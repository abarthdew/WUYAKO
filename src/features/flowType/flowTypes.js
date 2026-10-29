// 키오스크 연습 유형: 업종이 아닌 화면 흐름 기준. 순서가 곧 확장 순서(A → B → D → C).
//   C는 본인 인증 등 민감 화면이 있어 마지막.
export const FLOW_TYPES = [
  { id: 'A', label: '주문형', flow: ['카테고리', '메뉴', '옵션', '장바구니', '결제'], examples: ['음식점', '카페', '패스트푸드', '베이커리(메뉴판형)'], principle: '고르기 → 확인 → 결제' },
  { id: 'B', label: '예매형', flow: ['조건 입력', '목록 선택', '좌석', '인원', '결제'], examples: ['기차', '버스', '영화관'], principle: '달력·시간 입력' },
  { id: 'D', label: '스캔·계산형', flow: ['상품 스캔', '확인', '결제'], examples: ['셀프 계산대', '베이커리(인식형)'], principle: '스캔 결과 확인' },
  { id: 'C', label: '조회·발급형', flow: ['본인 확인', '항목 선택', '출력·수납'], examples: ['무인민원발급기', '병원 접수·수납', '주차 정산', '대기 등록'], principle: '정보 입력 → 번호·서류 받기' },
];

// 유형과 별개 축: 기기 형태(화면 비율·조작 위치)와 진입 동작(QR 등)
export const DEVICES = { kiosk: '세로형 키오스크', tablet: '태블릿', phone: '내 휴대폰' };
export const ENTRIES = { qr: 'QR 찍고 들어가기' };

export const getFlowType = (id) => FLOW_TYPES.find((t) => t.id === id) ?? null;
