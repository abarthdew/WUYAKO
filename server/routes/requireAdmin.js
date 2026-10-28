// 임시 관리자 확인. 관리자 인증 방식은 ABTHDW-54에서 확정(Supabase Auth 등)하고 이 파일만 교체한다.
export const requireAdmin = async (c, next) => {
  const token = process.env.ADMIN_TOKEN;
  if (!token) {
    if (process.env.NODE_ENV === 'production') return c.json({ error: 'admin_disabled' }, 403);
    return next(); // 로컬 개발: 토큰 없으면 허용
  }
  if (c.req.header('authorization') !== `Bearer ${token}`) return c.json({ error: 'unauthorized' }, 401);
  return next();
};
