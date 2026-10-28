import { addLine, changeQty, removeLine } from '../features/cart/cart.js';

// 화면 흐름: (1·2단계: mode →) mission → idle → dine → menu(⇄ option) → cart → payment → done
export const initialState = {
  screen: 'home',
  stageId: 1,
  dine: null,
  category: 'burger',
  cart: [],
  option: null, // { menuId, set: null|bool, drinkId }
  upsell: false,
  payMethod: null,
  startedAt: null,
  result: null, // checkMission 결과
  mode: null, // 1·2단계 연습 방식: 'follow'(따라서 해볼래요) | 'help'(도움이 필요해요)
  offGuideTaps: 0, // 가이드와 다른 곳을 누른 횟수 (화면 표시용, 저장은 tap 원물)
};

export const sessionReducer = (state, action) => {
  switch (action.type) {
    case 'START_STAGE':
      return { ...initialState, stageId: action.stageId, screen: action.screen ?? 'mission' };
    case 'SET_MODE':
      return { ...state, mode: action.mode, screen: 'mission' };
    case 'OFF_GUIDE_TAP':
      return { ...state, offGuideTaps: state.offGuideTaps + 1 };
    case 'GO':
      return {
        ...state,
        screen: action.screen,
        startedAt: action.screen === 'idle' ? action.now : state.startedAt,
      };
    case 'SET_DINE':
      return { ...state, dine: action.dine, screen: 'menu' };
    case 'SELECT_CATEGORY':
      return { ...state, category: action.category };
    case 'OPEN_OPTION':
      return { ...state, option: { menuId: action.menuId, set: null, drinkId: null } };
    case 'SET_OPTION':
      return { ...state, option: { ...state.option, ...action.patch } };
    case 'CLOSE_OPTION':
      return { ...state, option: null };
    case 'ADD_TO_CART':
      return {
        ...state,
        cart: addLine(state.cart, action.line),
        option: null,
        upsell: action.upsell ?? false,
      };
    case 'CLOSE_UPSELL':
      return { ...state, upsell: false };
    case 'CHANGE_QTY':
      return { ...state, cart: changeQty(state.cart, action.key, action.delta) };
    case 'REMOVE_LINE':
      return { ...state, cart: removeLine(state.cart, action.key) };
    case 'SET_PAY':
      return { ...state, payMethod: action.method };
    case 'COMPLETE':
      return { ...state, result: action.result, screen: 'done' };
    case 'CANCEL_ORDER':
      return { ...initialState, stageId: state.stageId, screen: 'idle', startedAt: state.startedAt, mode: state.mode, offGuideTaps: state.offGuideTaps };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};
