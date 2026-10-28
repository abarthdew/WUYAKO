import { useState } from 'react';
import { adminApi, setToken } from './adminApi.js';

export default function LoginForm({ onLogin }) {
  const [token, setValue] = useState('');
  const [error, setError] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    setToken(token);
    try {
      await adminApi.checkSession();
      onLogin();
    } catch (err) {
      setToken('');
      setError(err.status === 401 ? '관리자 키가 맞지 않아요.' : '서버에 연결할 수 없어요.');
    }
  };
  return (
    <form className="admin-login" onSubmit={submit}>
      <h1>우야꼬 관리자</h1>
      <label>
        관리자 키
        <input type="password" value={token} onChange={(e) => setValue(e.target.value)} autoComplete="current-password" />
      </label>
      <p className="admin-login__hint">로컬 개발에서 ADMIN_TOKEN을 비워 두면 아무 값이나 통과합니다.</p>
      {error && <p className="admin-error" role="alert">{error}</p>}
      <button type="submit" className="admin-btn admin-btn--primary">들어가기</button>
    </form>
  );
}
