import './GuideHand.css';

// 화면에서 유일하게 움직이는 요소. 대상 버튼 안에 붙는다.
// 기기 글꼴에 따라 이모지가 안 보일 수 있어 직접 그린 SVG를 쓴다.
export default function GuideHand() {
  return (
    <svg className="guide-hand" viewBox="0 0 32 40" aria-hidden="true">
      <path d="M12 3a3 3 0 0 1 6 0v13l1-.5a3 3 0 0 1 4 1.6l.3.7.7-.3a3 3 0 0 1 3.9 1.9l.1.4a3 3 0 0 1 2 2.8V30c0 5-4 9-9 9h-4.6a8 8 0 0 1-6.3-3.1L3.3 28a3 3 0 0 1 4.6-3.8L12 28z" />
    </svg>
  );
}
