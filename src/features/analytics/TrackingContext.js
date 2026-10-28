import { createContext, useContext } from 'react';
import { track } from './analytics.js';

// 기록 함수를 주입한다. 관리자 미리보기처럼 기록하면 안 되는 곳은 noop을 넣는다.
export const TrackingContext = createContext(track);
export const useTrack = () => useContext(TrackingContext);
export const noTracking = () => {};
