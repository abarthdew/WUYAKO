// Web Speech API 래퍼. 기기마다 음성 목록이 달라 ko 계열을 찾아 쓴다.
const pickVoice = () =>
  window.speechSynthesis?.getVoices().find((v) => v.lang?.toLowerCase().startsWith('ko')) ?? null;

export const isSpeechSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

export const speak = (text, { rate = 0.9 } = {}) => {
  if (!isSpeechSupported() || !text) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ko-KR';
  utter.rate = rate;
  const voice = pickVoice();
  if (voice) utter.voice = voice;
  window.speechSynthesis.speak(utter);
};
