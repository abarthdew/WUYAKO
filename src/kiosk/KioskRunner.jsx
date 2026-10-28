import { useEffect, useMemo, useReducer } from 'react';
import KioskFrame from '../components/KioskFrame.jsx';
import { StageContext } from '../app/StageContext.js';
import { useTrack } from '../features/analytics/TrackingContext.js';
import { guideTarget } from '../features/guide/guideTarget.js';
import { checkMission } from '../features/mission/checkMission.js';
import DoneScreen from '../screens/DoneScreen.jsx';
import MissionScreen from '../screens/MissionScreen.jsx';
import { initialState, sessionReducer } from './sessionReducer.js';

const KIOSK_SCREENS = ['idle', 'dine', 'menu', 'cart', 'payment'];

// 주문 흐름 실행기. 모양(version.screens)·데이터(theme, mission)는 주입받는다.
// mission이 없으면 자유 주문 모드(가이드·채점 없음).
export default function KioskRunner({ version, theme, mission, missionKey, onExit, onNext }) {
  const stage = version.config;
  const track = useTrack();
  const [state, dispatch] = useReducer(sessionReducer, { ...initialState, stageId: stage.id, screen: 'mission' });
  const target = stage.guide !== 'none' && mission ? guideTarget(state, mission, theme) : null;
  const ctx = useMemo(() => ({ stage, target, screen: state.screen }), [stage, target, state.screen]);

  useEffect(() => {
    track('screen_view', { stage: stage.id, versionId: version.id, screen: state.screen });
  }, [state.screen, stage.id, version.id, track]);

  const begin = () => {
    track('stage_start', { stage: stage.id, versionId: version.id, missionKey: missionKey ?? null, themeSlug: theme.id });
    dispatch({ type: 'GO', screen: 'idle', now: Date.now() });
  };

  const addToCart = (line) => {
    const menu = theme.menu.find((m) => m.id === line.menuId);
    dispatch({ type: 'ADD_TO_CART', line, upsell: stage.upsell && menu?.options === 'set' && !!theme.upsell });
  };

  const pay = () => {
    // 원물만 기록: 무엇을 골랐는지. 성공 여부는 읽을 때 미션과 비교해 계산.
    track('order_submit', { dine: state.dine, cart: state.cart, payMethod: state.payMethod });
    dispatch({ type: 'COMPLETE', result: mission ? checkMission(mission, state) : null });
  };

  const props = { state, store: theme, dispatch };
  const S = version.screens;
  const kioskScreen = {
    idle: () => <S.idle onTouch={() => dispatch({ type: 'GO', screen: 'dine' })} />,
    dine: () => <S.dine onSelect={(dine) => dispatch({ type: 'SET_DINE', dine })} />,
    menu: () => <S.menu {...props} onAdd={addToCart} onCancel={() => dispatch({ type: 'CANCEL_ORDER' })} />,
    cart: () => <S.cart {...props} />,
    payment: () => <S.payment {...props} onPaid={pay} />,
  }[state.screen];

  return (
    <StageContext.Provider value={ctx}>
      {state.screen === 'mission' && <MissionScreen stage={stage} mission={mission} onBegin={begin} onBack={onExit} />}
      {KIOSK_SCREENS.includes(state.screen) && (
        <KioskFrame storeName={theme.storeName} startedAt={state.startedAt}>
          {kioskScreen()}
        </KioskFrame>
      )}
      {state.screen === 'done' && (
        <DoneScreen
          result={state.result}
          store={theme}
          mission={mission}
          onRetry={() => dispatch({ type: 'START_STAGE', stageId: stage.id })}
          onNext={state.result?.success && onNext ? onNext : null}
          onHome={onExit}
        />
      )}
    </StageContext.Provider>
  );
}
