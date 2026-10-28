import { isSpeechSupported, speak } from '../features/speech/speak.js';
import './SpeakButton.css';

export default function SpeakButton({ text }) {
  if (!isSpeechSupported()) return null;
  return (
    <button type="button" className="speak-btn" onClick={() => speak(text)} aria-label="소리로 듣기">
      🔊 들려주세요
    </button>
  );
}
