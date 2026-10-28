import CartScreen from '../../screens/CartScreen.jsx';
import DineScreen from '../../screens/DineScreen.jsx';
import IdleScreen from '../../screens/IdleScreen.jsx';
import MenuScreen from '../../screens/MenuScreen.jsx';
import PaymentScreen from '../../screens/PaymentScreen.jsx';

// v1 모양: 흐름 화면 묶음. 새 버전은 이 묶음을 통째로 또는 일부만 바꿔 등록한다.
export const v1Screens = {
  idle: IdleScreen,
  dine: DineScreen,
  menu: MenuScreen,
  cart: CartScreen,
  payment: PaymentScreen,
};
