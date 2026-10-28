import { GLYPHS } from './glyphs.jsx';
import './Pictogram.css';

export default function Pictogram({ glyph }) {
  const g = GLYPHS[glyph];
  if (!g) return null;
  return (
    <svg className="picto" viewBox="0 0 24 24" role="img" aria-label={g.label}>
      {g.draw}
    </svg>
  );
}
