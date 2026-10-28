import { navigate } from '../app/router.js';
import Notice from '../components/Notice.jsx';
import { useDocument } from '../content/useDocument.js';
import HomeLayout from '../home/HomeLayout.jsx';
import ShareButton from '../components/ShareButton.jsx';

// 메인 화면: 관리자가 게시한 구성(layout/home)을 그린다
export default function HomeScreen() {
  const layout = useDocument('layout', 'home');
  if (layout.status === 'loading') return <Notice text="불러오는 중…" />;
  if (!layout.data) return <Notice text="메인 화면 구성을 찾을 수 없어요." />;
  return (
    <HomeLayout layout={layout.data} onOpen={navigate}>
      <ShareButton place="home" label="부모님께 카톡으로 보내기" text="키오스크, 이제 혼자서도 할 수 있어요. 우야꼬에서 연습해 보세요!" />
    </HomeLayout>
  );
}
