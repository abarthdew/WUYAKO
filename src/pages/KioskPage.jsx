import { useDocument } from '../content/useDocument.js';
import { navigate } from '../app/router.js';
import KioskRunner from '../kiosk/KioskRunner.jsx';
import { getVersion, nextStageVersion } from '../kiosk/versions/registry.js';
import Notice from '../components/Notice.jsx';

// #/kiosk/:versionId?theme=slug → 버전 + 테마 + 미션을 모아 실행기에 넘긴다.
export default function KioskPage({ versionId, themeSlug = 'fastfood' }) {
  const version = getVersion(versionId);
  const missionKey = version ? `${themeSlug}-s${version.stage}` : null;
  const theme = useDocument('theme', themeSlug);
  const mission = useDocument('mission', missionKey);

  if (!version) return <Notice text="없는 화면이에요." onHome={() => navigate('/')} />;
  if (theme.status === 'loading' || mission.status === 'loading') return <Notice text="불러오는 중…" />;
  if (!theme.data) return <Notice text="가게 정보를 찾을 수 없어요." onHome={() => navigate('/')} />;

  const next = nextStageVersion(version.id);
  return (
    <KioskRunner
      key={`${version.id}-${themeSlug}`}
      version={version}
      theme={theme.data}
      mission={mission.data}
      missionKey={mission.data ? missionKey : null}
      onExit={() => navigate('/')}
      onNext={next ? () => navigate(`/kiosk/${next}?theme=${themeSlug}`) : null}
    />
  );
}
