import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { authApi, getSession } from '@/api/auth';
import type { AdminSession } from '@/types/models';
import { AdminAuthContext } from './admin-auth-context';

/**
 * 后台登录态。
 * 初始值同步读取本地会话，路由守卫首帧就能判断，不会先闪一下登录页。
 */
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(() => getSession());

  const login = useCallback(async (username: string, password: string) => {
    const next = await authApi.login(username, password);
    setSession(next);
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setSession(null);
  }, []);

  const value = useMemo(() => ({ session, login, logout }), [session, login, logout]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}
