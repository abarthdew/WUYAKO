// 장식용 QR 그림 (읽히는 코드 아님). 모서리 세 개의 네모가 QR의 표시.
const CELLS = '1011010100110110100101101001011001101011010010110110100101011'.split('');

const Finder = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width="7" height="7" />
    <rect x="1" y="1" width="5" height="5" fill="#fff" />
    <rect x="2" y="2" width="3" height="3" />
  </g>
);

export default function QrCode({ className }) {
  return (
    <svg className={className} viewBox="0 0 21 21" aria-hidden="true">
      <rect width="21" height="21" fill="#fff" />
      <Finder x={0} y={0} />
      <Finder x={14} y={0} />
      <Finder x={0} y={14} />
      {CELLS.map((c, i) => c === '1' && <rect key={i} x={8 + (i % 13)} y={8 + Math.floor(i / 13) * 2.5} width="1" height="1" />)}
    </svg>
  );
}
