import './GuideHand.css';

// 화면에서 유일하게 움직이는 요소. 대상 버튼 안에 붙는다.
export default function GuideHand() {
  return (
    <span className="guide-hand" aria-hidden="true">
      👆
    </span>
  );
}
