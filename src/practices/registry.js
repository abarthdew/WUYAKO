import QrOrderPractice from './qrOrder/QrOrderPractice.jsx';
import * as qrOrder from './qrOrder/qrOrderModel.js';
import WaitlistPractice from './waitlist/WaitlistPractice.jsx';
import * as waitlist from './waitlist/waitlistModel.js';
import qrOrderContent from '../data/practices/qr-order.json';
import waitlistContent from '../data/practices/waitlist.json';

// 짧은 연습 등록부. 주문 키오스크(kiosk/)와 별개로, 화면 하나짜리 작은 성공 경험.
//   flowType: 연습 유형(features/flowType), device: 기기 형태, entry: 진입 동작(없으면 null)
//   model: { init, reduce, targetOf, isFinished, resultOf, rawOf } 순수 함수 묶음
//   content: 묶음 데이터 (콘텐츠 문서로 옮길지는 미정)
const PRACTICES = [
  { id: 'qr-order', title: 'QR로 주문하기', summary: '식탁의 QR을 휴대폰으로 찍어요', icon: '📱', flowType: 'A', device: 'phone', entry: 'qr', model: qrOrder, component: QrOrderPractice, content: qrOrderContent },
  { id: 'waitlist', title: '줄 서기 등록', summary: '인원과 번호만 누르면 끝', icon: '🎫', flowType: 'C', device: 'tablet', entry: null, model: waitlist, component: WaitlistPractice, content: waitlistContent },
];

export const listPractices = () => PRACTICES;
export const getPractice = (id) => PRACTICES.find((p) => p.id === id) ?? null;
