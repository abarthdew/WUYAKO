import MoviePractice from './movie/MoviePractice.jsx';
import * as movie from './movie/movieModel.js';
import QrOrderPractice from './qrOrder/QrOrderPractice.jsx';
import * as qrOrder from './qrOrder/qrOrderModel.js';
import SelfCheckoutPractice from './selfCheckout/SelfCheckoutPractice.jsx';
import * as selfCheckout from './selfCheckout/selfCheckoutModel.js';
import WaitlistPractice from './waitlist/WaitlistPractice.jsx';
import * as waitlist from './waitlist/waitlistModel.js';
import movieContent from '../data/practices/movie.json';
import qrOrderContent from '../data/practices/qr-order.json';
import selfCheckoutContent from '../data/practices/self-checkout.json';
import waitlistContent from '../data/practices/waitlist.json';

// 짧은 연습 등록부. 주문 키오스크(kiosk/)와 별개로, 화면 하나짜리 작은 성공 경험.
//   flowType: 연습 유형(features/flowType), device: 기기 형태, entry: 진입 동작(없으면 null)
//   model: { init, reduce, targetOf, isFinished, resultOf, rawOf } 순수 함수 묶음 (targetOf·resultOf는 (state, mission, content))
//   content: 묶음 데이터 (콘텐츠 문서로 옮길지는 미정)
const PRACTICES = [
  { id: 'qr-order', title: 'QR로 주문하기', summary: '식탁의 QR을 휴대폰으로 찍어요', icon: '📱', flowType: 'A', device: 'phone', entry: 'qr', model: qrOrder, component: QrOrderPractice, content: qrOrderContent },
  { id: 'movie', title: '영화표 예매', summary: '날짜 → 시간 → 자리 고르기', icon: '🎬', flowType: 'B', device: 'kiosk', entry: null, model: movie, component: MoviePractice, content: movieContent },
  { id: 'self-checkout', title: '셀프 계산대', summary: '바코드 찍고 직접 계산해요', icon: '🛒', flowType: 'D', device: 'kiosk', entry: null, model: selfCheckout, component: SelfCheckoutPractice, content: selfCheckoutContent },
  { id: 'waitlist', title: '줄 서기 등록', summary: '인원과 번호만 누르면 끝', icon: '🎫', flowType: 'C', device: 'tablet', entry: null, model: waitlist, component: WaitlistPractice, content: waitlistContent },
];

export const listPractices = () => PRACTICES;
export const getPractice = (id) => PRACTICES.find((p) => p.id === id) ?? null;
