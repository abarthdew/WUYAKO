import { useEffect, useMemo, useReducer } from 'react';
import store from '../data/fastfood.json';
import missions from '../data/missions.json';
import KioskFrame from '../components/KioskFrame.jsx';
import { track } from '../features/analytics/analytics.js';
import { guideTarget } from '../features/guide/guideTarget.js';
import { checkMission } from '../features/mission/checkMission.js';
import { getStage, STAGES } from '../features/stage/stages.js';
import CartScreen from '../screens/CartScreen.jsx';
import DineScreen from '../screens/DineScreen.jsx';
import DoneScreen from '../screens/DoneScreen.jsx';
import HomeScreen from '../screens/HomeScreen.jsx';
import IdleScreen from '../screens/IdleScreen.jsx';
import MenuScreen from '../screens/MenuScreen.jsx';
import MissionScreen from '../screens/MissionScreen.jsx';
import PaymentScreen from '../screens/PaymentScreen.jsx';
import { StageContext } from './StageContext.js';
import { initialState, sessionReducer } from './sessionReducer.js';
import './App.css';

const KIOSK_SCREENS = ['idle', 'dine', 'menu', 'cart', 'payment'];

export default function App() {
  const [state, dispatch] = useReducer(sessionReducer, initialState);
  const stage = getStage(state.stageId);
  const mission = missions[stage.id];
  const target = stage.guide ? guideTarget(state, mission, store) : null;
  const ctx = useMemo(() => ({ stage, target }), [stage, target]);

  useEffect(() => {
    track('screen_view', { stage: stage.id, screen: state.screen });
  }, [state.screen, stage.id]);

  const start = (stageId) => {
    track('stage_start', { stage: stageId });
    dispatch({ type: 'START_STAGE', stageId });
  };

  const addToCart = (line) => {
    const menu = store.menu.find((m) => m.id === line.menuId);
    dispatch({ type: 'ADD_TO_CART', line, upsell: stage.upsell && menu.options === 'set' });
  };

  const pay = () => {
    const result = checkMission(mission, state);
    track('order_complete', {
      stage: stage.id,
      success: result.success,
      durationMs: Date.now() - (state.startedAt ?? Date.now()),
    });
    dispatch({ type: 'COMPLETE', result });
  };

  const nextStageId = Object.keys(STAGES).map(Number).find((id) => id > stage.id);

  const renderKiosk = () => {
    switch (state.screen) {
      case 'idle':
        return <IdleScreen onTouch={() => dispatch({ type: 'GO', screen: 'dine', now: Date.now() })} />;
      case 'dine':
        return <DineScreen onSelect={(dine) => dispatch({ type: 'SET_DINE', dine })} />;
      case 'menu':
        return (
          <MenuScreen
            state={state}
            store={store}
            dispatch={dispatch}
            onAdd={addToCart}
            onCancel={() => dispatch({ type: 'CANCEL_ORDER' })}
          />
        );
      case 'cart':
        return <CartScreen state={state} store={store} dispatch={dispatch} />;
      case 'payment':
        return <PaymentScreen state={state} store={store} dispatch={dispatch} onPaid={pay} />;
      default:
        return null;
    }
  };

  return (
    <StageContext.Provider value={ctx}>
      <div className="app">
        {state.screen === 'home' && <HomeScreen onStart={start} />}
        {state.screen === 'mission' && (
          <MissionScreen
            stage={stage}
            mission={mission}
            onBegin={() => dispatch({ type: 'GO', screen: 'idle', now: Date.now() })}
            onBack={() => dispatch({ type: 'RESET' })}
          />
        )}
        {KIOSK_SCREENS.includes(state.screen) && (
          <KioskFrame storeName={store.storeName} startedAt={state.startedAt}>
            {renderKiosk()}
          </KioskFrame>
        )}
        {state.screen === 'done' && (
          <DoneScreen
            result={state.result}
            store={store}
            mission={mission}
            onRetry={() => start(stage.id)}
            onNext={state.result.success && nextStageId ? () => start(nextStageId) : null}
            onHome={() => dispatch({ type: 'RESET' })}
          />
        )}
      </div>
    </StageContext.Provider>
  );
}
