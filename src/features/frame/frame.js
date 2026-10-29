import { DEVICES } from '../flowType/flowTypes.js';

// 키오스크 외곽 설정: 기기 형태(device) + 스킨(skin). 화면은 그대로, 외곽·색만 바뀐다.
// 메인 칸마다 고를 수 있고 주소(?device=&skin=)로 전달된다.
export const SKINS = { color: '기본 색', mono: '무채색' };

export const isDevice = (v) => Object.hasOwn(DEVICES, v);
export const isSkin = (v) => Object.hasOwn(SKINS, v);

// 주소 쿼리 → 외곽 설정. fixedDevice면 기기 형태는 바꿀 수 없다 (예: QR 주문은 항상 휴대폰).
export const readFrame = (query, { device = 'kiosk', fixedDevice = false } = {}) => ({
  device: !fixedDevice && isDevice(query.device) ? query.device : device,
  skin: isSkin(query.skin) ? query.skin : 'color',
});

// 칸 설정 → 주소 쿼리 조각 (기본값은 생략)
export const frameQuery = ({ device, skin }) =>
  [device && device !== 'kiosk' && `device=${device}`, skin && skin !== 'color' && `skin=${skin}`].filter(Boolean).join('&');
