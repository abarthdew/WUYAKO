import { num } from '../format.js';

const PLACE = { home: '메인 화면', done: '미션 성공' };
const METHOD = { kakao: '카카오', webshare: '휴대폰 공유창', copy: '링크 복사', cancelled: '취소', failed: '실패' };

// 유입 경로(UTM) + 공유 버튼 클릭
export default function InflowTable({ data }) {
  return (
    <div className="dash-two">
      <table className="dash-table">
        <caption>유입 경로</caption>
        <thead><tr><th>출처</th><th>캠페인</th><th>세션</th></tr></thead>
        <tbody>
          {data.sources.length ? (
            data.sources.map((s) => (
              <tr key={`${s.source}-${s.campaign}`}><td>{s.source}</td><td>{s.campaign || '–'}</td><td>{num(s.count)}</td></tr>
            ))
          ) : (
            <tr><td colSpan={3}>기록 없음</td></tr>
          )}
        </tbody>
      </table>
      <table className="dash-table">
        <caption>공유 버튼</caption>
        <thead><tr><th>위치</th><th>방법</th><th>클릭</th></tr></thead>
        <tbody>
          {data.shares.length ? (
            data.shares.map((s) => (
              <tr key={`${s.place}-${s.method}`}><td>{PLACE[s.place] ?? s.place}</td><td>{METHOD[s.method] ?? s.method}</td><td>{num(s.count)}</td></tr>
            ))
          ) : (
            <tr><td colSpan={3}>기록 없음</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
