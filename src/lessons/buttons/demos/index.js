import BackDemo from './BackDemo.jsx';
import BadgeDemo from './BadgeDemo.jsx';
import ClosePopupDemo from './ClosePopupDemo.jsx';
import DisabledDemo from './DisabledDemo.jsx';
import OpenMenuDemo from './OpenMenuDemo.jsx';
import SwipeDemo from './SwipeDemo.jsx';
import TabsDemo from './TabsDemo.jsx';
import TapDemo from './TapDemo.jsx';

// 콘텐츠의 demo 값 → 체험 컴포넌트. 모든 체험은 { icon, onSuccess }를 받는다.
export const DEMOS = {
  'open-menu': OpenMenuDemo,
  back: BackDemo,
  'close-popup': ClosePopupDemo,
  badge: BadgeDemo,
  tabs: TabsDemo,
  swipe: SwipeDemo,
  disabled: DisabledDemo,
  tap: TapDemo,
};
