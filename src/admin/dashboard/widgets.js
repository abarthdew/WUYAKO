import DailySessions from './widgets/DailySessions.jsx';
import InflowTable from './widgets/InflowTable.jsx';
import KpiTiles from './widgets/KpiTiles.jsx';
import LessonTable from './widgets/LessonTable.jsx';
import StageTable from './widgets/StageTable.jsx';

// 대시보드 항목 등록부. 새 항목 = 서버 지표(server/read) + 위젯 컴포넌트 + 여기 한 줄
// wide: 두 칸 차지
export const WIDGETS = [
  { id: 'kpis', title: null, component: KpiTiles, wide: true },
  { id: 'daily', title: '일별 방문 세션', component: DailySessions, wide: true },
  { id: 'stages', title: '키오스크 연습 (단계·연습 방식별)', component: StageTable, wide: true },
  { id: 'lessons', title: '원리 학습', component: LessonTable },
  { id: 'inflow', title: '유입·공유', component: InflowTable },
];
