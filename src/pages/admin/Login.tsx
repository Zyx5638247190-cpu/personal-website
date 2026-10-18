import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { DragonMascot } from '@/components/mascot/DragonMascot';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/admin/FormControls';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { errorMessage } from '@/lib/error';
import { ArrowLeftIcon, LockIcon } from '@/components/icons';

/** 登录后回到被拦截的页面；只接受站内后台地址，避免被外部字符串带跑 */
function resolveFrom(state: unknown): string {
  const from = (state as { from?: unknown } | null)?.from;
  return typeof from === 'string' && from.startsWith('/admin') ? from : '/admin';
}

export default function AdminLogin() {
  const { session, login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = resolveFrom(location.state);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useDocumentMeta({ title: '登录 · 奶龙后台' });

  // 已登录再访问登录页直接进后台，避免重复登录
  if (session) return <Navigate to={from} replace />;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError('账号和密码都要填哦');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (reason) {
      setError(errorMessage(reason, '登录失败，再试一次？'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <DragonMascot size={104} mood="curious" />
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-text">奶龙后台</h1>
          <p className="mt-2 text-sm text-text-muted">
            登录后可以管理个人信息、技能、项目与博客。
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4 rounded-card border border-border bg-surface/80 p-5 backdrop-blur-sm sm:p-6"
        >
          {error ? (
            <p
              role="alert"
              className="rounded-card border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-danger"
            >
              {error}
            </p>
          ) : null}

          <TextField
            label="账号"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="admin"
            autoFocus
          />
          <TextField
            label="密码"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••"
          />

          <Button type="submit" className="w-full" disabled={submitting}>
            <LockIcon className="h-4 w-4" />
            {submitting ? '正在叫醒奶龙…' : '登录后台'}
          </Button>

          <p className="text-center text-[11px] text-text-dim">
            演示账号：admin · 密码：123456
          </p>
        </form>

        <Link
          to="/"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 text-sm text-text-muted transition-colors hover:text-primary-ink"
        >
          <ArrowLeftIcon />
          回到前台
        </Link>
      </div>
    </div>
  );
}
