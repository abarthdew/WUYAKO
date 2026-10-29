import { useEffect, useMemo, useReducer, useState } from 'react';
import KioskFrame from '../components/KioskFrame.jsx';
import { StageContext } from '../app/StageContext.js';
import { useTrack } from '../features/analytics/TrackingContext.js';
import { guideTarget } from '../features/guide/guideTarget.js';
import { checkMission } from '../features/mission/checkMission.js';
import DoneScreen from '../screens/DoneScreen.jsx';
import MissionScreen from '../screens/MissionScreen.jsx';
import ModeScreen from '../screens/ModeScreen.jsx';
import { initialState, sessionReducer } from './sessionReducer.js';

const KIOSK_SCREENS = ['idle', 'dine', 'menu', 'cart', 'payment'];

// 주문 흐름 실행기. 모양(version.screens)·데이터(theme, mission)는 주입받는다.
// mission이 없으면 자유 주문 모드(가이드·채점 없음).
// 가이드 단계(1·2)는 먼저 연습 방식을 고른다: follow는 누른 대로 진행, help는 엉뚱한 곳을 막고 말풍선.
export default function KioskRunner({ version, theme, mission, missionKey, frame, onExit, onNext, nextLabel }) {
  const stage = version.config;
  const track = useTrack();
  const firstScreen = stage.guide !== 'none' && mission ? 'mode' : 'mission';
  const [state, dispatch] = useReducer(sessionReducer, { ...initialState, stageId: stage.id, screen: firstScreen });
  const target = stage.guide !== 'none' && mission ? guideTarget(state, mission, theme) : null;
  const [bubble, setBubble] = useState(false);
  const blockOffGuide = state.mode === 'help';
  const ctx = useMemo(
    () => ({
      stage,
      target,
      screen: state.screen,
      blockOffGuide,
      onOffGuide: () => {
        dispatch({ type: 'OFF_GUIDE_TAP' });
        if (blockOffGuide) setBubble(true);
      },
    }),
    [stage, target, state.screen, blockOffGuide],
  );
  // 올바른 곳을 눌러 다음 대상으로 넘어가면 말풍선을 닫는다
  useEffect(() => setBubble(false), [target]);
  const closeBubble = () => {
    track('guide_bubble_close', { screen: state.screen, guideTargetId: target });
    setBubble(false);
  };

  useEffect(() => {
    track('screen_view', { stage: stage.id, versionId: version.id, screen: state.screen });
  }, [state.screen, stage.id, version.id, track]);

  const begin = () => {
    track('stage_start', { stage: stage.id, versionId: version.id, missionKey: missionKey ?? null, themeSlug: theme.id, mode: state.mode });
    dispatch({ type: 'GO', screen: 'idle', now: Date.now() });
  };

  const addToCart = (line) => {
    const menu = theme.menu.find((m) => m.id === line.menuId);
    dispatch({ type: 'ADD_TO_CART', line, upsell: stage.upsell && menu?.options === 'set' && !!theme.upsell });
  };

  const pay = () => {
    // 원물만 기록: 무엇을 골랐는지. 성공 여부는 읽을 때 미션과 비교해 계산.
    track('order_submit', { dine: state.dine, cart: state.cart, payMethod: state.payMethod });
    dispatch({ type: 'COMPLETE', result: mission ? { ...checkMission(mission, state), dine: state.dine } : null });
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
      {state.screen === 'mode' && <ModeScreen stage={stage} onSelect={(mode) => dispatch({ type: 'SET_MODE', mode })} onBack={onExit} />}
      {state.screen === 'mission' && <MissionScreen stage={stage} mission={mission} onBegin={begin} onBack={onExit} />}
      {KIOSK_SCREENS.includes(state.screen) && (
        <KioskFrame storeName={theme.storeName} device={frame?.device} skin={frame?.skin} startedAt={state.startedAt} bubble={bubble} onCloseBubble={closeBubble}>
          {kioskScreen()}
        </KioskFrame>
      )}
      {state.screen === 'done' && (
        <DoneScreen
          result={state.result}
          store={theme}
          mission={mission}
          offGuideTaps={state.offGuideTaps}
          onRetry={() => dispatch({ type: 'START_STAGE', stageId: stage.id, screen: firstScreen })}
          onNext={state.result?.success && onNext ? onNext : null}
          nextLabel={nextLabel}
          onHome={onExit}
        />
      )}
    </StageContext.Provider>
  );
}
