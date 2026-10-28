import SpeakButton from '../../components/SpeakButton.jsx';
import './MissionCard.css';

export default function MissionCard({ mission, compact = false }) {
  return (
    <section className={`mission ${compact ? 'mission--compact' : ''}`} aria-label="오늘의 미션">
      <span className="mission__tag">미션</span>
      <p className="mission__text">{mission.text}</p>
      {!compact && <SpeakButton text={mission.text} />}
    </section>
  );
}
