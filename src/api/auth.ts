import { ApiError, readJson, removeStored, simulate, writeJson } from './client';
import type { AdminSession } from '@/types/models';

/**
 * 后台演示账号。
 * 只在前端校验，密码不写入任何存储；token 也只是「已登录」的占位凭证。
 * 静态站点没有真实服务端，这样的鉴权只能挡住误入，不能当作安全边界。
 */
const DEMO_USERNAME = 'admin';
const DEMO_PASSWORD = '123456';
const SESSION_KEY = 'nd:admin:session';
/** 会话有效期 8 小时，过期后路由守卫会重新要求登录 */
const SESSION_TTL = 8 * 60 * 60 * 1000;

function createToken(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  // 老浏览器兜底：token 只需要唯一，不需要密码学强度
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/** 同步读取会话，供路由守卫在首帧判断，避免登录页闪一下 */
export function getSession(): AdminSession | null {
  const session = readJson<AdminSession | null>(SESSION_KEY, null);
  if (!session?.token) return null;

  if (session.expiresAt <= Date.now()) {
    removeStored(SESSION_KEY);
    return null;
  }
  return session;
}

export const authApi = {
  async login(username: string, password: string): Promise<AdminSession> {
    return simulate(() => {
      const account = username.trim();
      if (account !== DEMO_USERNAME || password !== DEMO_PASSWORD) {
        throw new ApiError('账号或密码不对，再试一次？', 'INVALID');
      }

      const issuedAt = Date.now();
      const session: AdminSession = {
        token: createToken(),
        username: account,
        issuedAt,
        expiresAt: issuedAt + SESSION_TTL,
      };
      writeJson(SESSION_KEY, session);
      return session;
    });
  },

  logout(): void {
    removeStored(SESSION_KEY);
  },
};
