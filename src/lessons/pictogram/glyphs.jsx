// 우야꼬 자체 제작 픽토그램 (24x24 선 그림). 외부 아이콘 미사용 → 저작권 문제 없음.
// id → { label: 화면 읽기용 이름, draw: SVG 요소 }
export const GLYPHS = {
  cart: { label: '수레', draw: <><path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 8H6.2" /><circle cx="9" cy="19" r="1.5" /><circle cx="17" cy="19" r="1.5" /></> },
  basket: { label: '바구니', draw: <><path d="M3 10h18l-2 9H5z" /><path d="M8 10l4-6 4 6" /><path d="M9 13v3M12 13v3M15 13v3" /></> },
  bag: { label: '쇼핑백', draw: <><path d="M5 8h14l-1 12H6z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></> },
  trash: { label: '쓰레기통', draw: <><path d="M4 7h16M10 4h4M6 7l1 13h10l1-13" /><path d="M10 11v6M14 11v6" /></> },
  home: { label: '집', draw: <><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></> },
  gear: { label: '톱니바퀴', draw: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" /></> },
  lines: { label: '줄 세 개', draw: <path d="M4 6h16M4 12h16M4 18h16" /> },
  dots: { label: '점 세 개', draw: <><circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" /></> },
  grid: { label: '네모 네 개', draw: <><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><rect x="14" y="14" width="6" height="6" /></> },
  search: { label: '돋보기', draw: <><circle cx="10" cy="10" r="6" /><path d="M15 15l5 5" /></> },
  x: { label: '엑스', draw: <path d="M6 6l12 12M18 6L6 18" /> },
  'x-circle': { label: '동그라미 엑스', draw: <><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></> },
  'x-square': { label: '네모 엑스', draw: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9l6 6M15 9l-6 6" /></> },
  plus: { label: '더하기', draw: <path d="M12 5v14M5 12h14" /> },
  minus: { label: '빼기', draw: <path d="M5 12h14" /> },
  check: { label: '체크', draw: <path d="M5 12l5 5 9-10" /> },
  'chevron-left': { label: '왼쪽 꺾쇠', draw: <path d="M15 5l-7 7 7 7" /> },
  'chevron-right': { label: '오른쪽 꺾쇠', draw: <path d="M9 5l7 7-7 7" /> },
  'arrow-left': { label: '왼쪽 화살표', draw: <path d="M20 12H5M11 6l-6 6 6 6" /> },
  undo: { label: '돌아가는 화살표', draw: <><path d="M9 8H5V4" /><path d="M5 8a8 8 0 1 1-1 7" /></> },
};
