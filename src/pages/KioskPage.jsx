import { useDocument } from '../content/useDocument.js';
import { navigate } from '../app/router.js';
import KioskRunner from '../kiosk/KioskRunner.jsx';
import { getVersion, nextStageVersion } from '../kiosk/versions/registry.js';
import Notice from '../components/Notice.jsx';
import { readFrame } from '../features/frame/frame.js';
import { listPractices } from '../practices/registry.js';

// #/kiosk/:versionId?theme=slug&device=&skin= → 버전 + 테마 + 미션 + 외곽을 모아 실행기에 넘긴다.
// 마지막 단계 다음은 짧은 연습 첫 번째로 이어진다.
export default function KioskPage({ versionId, themeSlug = 'fastfood', query = {} }) {
  const version = getVersion(versionId);
  const missionKey = version ? `${themeSlug}-s${version.stage}` : null;
  const theme = useDocument('theme', themeSlug);
  const mission = useDocument('mission', missionKey);

  if (!version) return <Notice text="없는 화면이에요." onHome={() => navigate('/')} />;
  if (theme.status === 'loading' || mission.status === 'loading') return <Notice text="불러오는 중…" />;
  if (!theme.data) return <Notice text="가게 정보를 찾을 수 없어요." onHome={() => navigate('/')} />;

  const next = nextStageVersion(version.id);
  const firstPractice = listPractices()[0];
  return (
    <KioskRunner
      key={`${version.id}-${themeSlug}`}
      version={version}
      theme={theme.data}
      mission={mission.data}
      missionKey={mission.data ? missionKey : null}
      frame={readFrame(query, { device: version.device })}
      onExit={() => navigate('/')}
      onNext={() => navigate(next ? `/kiosk/${next}?theme=${themeSlug}` : `/practice/${firstPractice.id}`)}
      nextLabel={next ? '다음 단계 도전' : '다른 키오스크 도전'}
    />
  );
}
