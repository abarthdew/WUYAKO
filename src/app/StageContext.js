import { createContext, useContext } from 'react';

// stage: 단계 설정, target: 지금 누를 요소 id (가이드 없으면 null)
export const StageContext = createContext({ stage: null, target: null });
export const useStage = () => useContext(StageContext);
