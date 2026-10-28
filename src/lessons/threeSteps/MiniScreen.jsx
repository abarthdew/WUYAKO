import './MiniScreen.css';

// 업종별 가상 키오스크 화면 축소판. mock: grid(고르기) | list(확인) | pay(결제)
export default function MiniScreen({ industry, mock, icons, caption }) {
  return (
    <figure className="mini">
      <div className={`mini__screen mini__screen--${mock}`} aria-hidden="true">
        <div className="mini__bar">{industry}</div>
        {mock === 'grid' && (
          <div className="mini__grid">
            {icons.map((i) => (
              <span key={i}>{i}</span>
            ))}
          </div>
        )}
        {mock === 'list' && (
          <ul className="mini__list">
            {icons.map((i) => (
              <li key={i}>
                <span>{i}</span>
                <span className="mini__line" />
              </li>
            ))}
            <li className="mini__sum">합계 ▒▒▒원</li>
          </ul>
        )}
        {mock === 'pay' && (
          <div className="mini__pay">
            <span>{icons[0]}</span>
            <span className="mini__slot" />
          </div>
        )}
      </div>
      <figcaption>
        <strong>{industry}</strong> · {caption}
      </figcaption>
    </figure>
  );
}
