import { beforeEach, describe, expect, it } from 'vitest';
import { ApiError } from './client';
import { authApi, getSession } from './auth';

/**
 * 登录态是后台的唯一入口，重点验证三件事：
 * 1. 错误密码不放行；2. 密码绝不写进 localStorage；3. 过期会话自动失效。
 */
describe('后台登录与会话', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('账号或密码错误时抛出 INVALID，且不写入任何会话', async () => {
    await expect(authApi.login('admin', 'wrong')).rejects.toBeInstanceOf(ApiError);
    expect(getSession()).toBeNull();
    expect(window.localStorage.getItem('nd:admin:session')).toBeNull();
  });

  it('正确账号登录后只保存 token，不保存明文密码', async () => {
    const session = await authApi.login('admin', '123456');
    const raw = window.localStorage.getItem('nd:admin:session');

    expect(session.token).toBeTruthy();
    expect(session.username).toBe('admin');
    expect(raw).toBeTruthy();
    expect(raw).not.toContain('123456');
    expect(raw).not.toContain('password');
    expect(getSession()?.token).toBe(session.token);
  });

  it('过期会话会在读取时被清除', () => {
    window.localStorage.setItem(
      'nd:admin:session',
      JSON.stringify({
        token: 'expired-token',
        username: 'admin',
        issuedAt: Date.now() - 10_000,
        expiresAt: Date.now() - 1,
      })
    );

    expect(getSession()).toBeNull();
    expect(window.localStorage.getItem('nd:admin:session')).toBeNull();
  });

  it('退出登录会清除本地会话', async () => {
    await authApi.login('admin', '123456');
    authApi.logout();

    expect(getSession()).toBeNull();
    expect(window.localStorage.getItem('nd:admin:session')).toBeNull();
  });
});
