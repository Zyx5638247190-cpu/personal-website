import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { DragonMascot } from '@/components/mascot/DragonMascot';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import {
  DashboardIcon,
  EyeIcon,
  FileTextIcon,
  FolderIcon,
  LogoutIcon,
  MenuIcon,
  SparkleIcon,
  UserIcon,
} from '@/components/icons';
import { cn } from '@/lib/cn';

const NAV_ITEMS = [
  { to: '/admin', label: '仪表盘', icon: DashboardIcon, end: true },
  { to: '/admin/profile', label: '个人信息', icon: UserIcon, end: false },
  { to: '/admin/skills', label: '技能管理', icon: SparkleIcon, end: false },
  { to: '/admin/projects', label: '项目管理', icon: FolderIcon, end: false },
  { to: '/admin/posts', label: '博客管理', icon: FileTextIcon, end: false },
] as const;

/** 顶栏标题：编辑器页单独显示动作名，其余取左侧导航标签 */
function resolveTitle(pathname: string): string {
  if (pathname === '/admin') return '仪表盘';
  if (pathname.startsWith('/admin/profile')) return '个人信息';
  if (pathname.startsWith('/admin/skills')) return '技能管理';
  if (pathname.startsWith('/admin/projects')) {
    if (pathname.endsWith('/new')) return '新建项目';
    if (pathname.endsWith('/edit')) return '编辑项目';
    return '项目管理';
  }
  if (pathname.startsWith('/admin/posts')) {
    if (pathname.endsWith('/new')) return '新建博客';
    if (pathname.endsWith('/edit')) return '编辑博客';
    return '博客管理';
  }
  return '后台';
}

/**
 * 后台独立布局：左侧边栏 + 顶栏，不复用前台 Navbar。
 * 移动端侧栏变成抽屉，Esc 或点击遮罩关闭；路由变化时自动收起并回到顶部。
 */
export function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { session, logout } = useAdminAuth();
  const title = resolveTitle(location.pathname);

  useEffect(() => {
    // 路由切换后回到内容顶部；抽屉由导航点击负责收起，避免在 effect 里同步 setState
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="relative min-h-dvh">
      <a href="#admin-main" className="skip-link">
        跳到主要内容
      </a>

      <aside
        id="admin-sidebar"
        aria-label="后台导航"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-bg-soft/95 backdrop-blur-xl',
          // visibility 参与过渡：收起后元素不可聚焦，避免键盘 Tab 跑到屏幕外的侧栏里
          'transition-[transform,visibility] duration-300 lg:visible lg:translate-x-0',
          menuOpen ? 'visible translate-x-0' : 'invisible -translate-x-full'
        )}
      >
        <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-border px-4">
          <DragonMascot size={34} headOnly animated={false} />
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight text-text">奶龙后台</p>
            <p className="text-[10px] tracking-[0.18em] text-text-dim uppercase">Admin</p>
          </div>
        </div>

        <nav aria-label="后台主导航" className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex min-h-11 items-center gap-3 rounded-card border px-3 text-sm transition-colors',
                        isActive
                          ? 'border-primary-500/30 bg-primary-500/12 text-primary-ink'
                          : 'border-transparent text-text-muted hover:bg-surface-hover hover:text-text'
                      )
                    }
                  >
                    <Icon className="shrink-0" />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 space-y-1 border-t border-border p-3">
          <Link
            to="/"
            className="flex min-h-11 items-center gap-3 rounded-card border border-transparent px-3 text-sm text-text-muted transition-colors hover:bg-surface-hover hover:text-text"
          >
            <EyeIcon className="shrink-0" />
            查看前台
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-11 w-full items-center gap-3 rounded-card border border-transparent px-3 text-sm text-text-muted transition-colors hover:bg-surface-hover hover:text-text"
          >
            <LogoutIcon className="shrink-0" />
            退出登录
          </button>
          <p className="px-3 pt-1 text-[11px] text-text-dim">
            已登录：{session?.username ?? '—'}
          </p>
        </div>
      </aside>

      {menuOpen ? (
        <button
          type="button"
          aria-label="关闭菜单"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="打开菜单"
              aria-expanded={menuOpen}
              aria-controls="admin-sidebar"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface/60 text-text lg:hidden"
            >
              <MenuIcon />
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-text">{title}</p>
              <p className="hidden text-[11px] text-text-dim sm:block">
                奶龙后台 · 内容管理
              </p>
            </div>

            <ThemeToggle />
            <Link
              to="/"
              className="hidden h-11 items-center gap-2 rounded-button border border-primary-500/50 px-4 text-sm text-primary-ink transition-colors hover:border-primary-500 hover:bg-primary-500/10 sm:inline-flex"
            >
              <EyeIcon />
              前台
            </Link>
          </div>
        </header>

        <main
          id="admin-main"
          className="mx-auto w-full max-w-5xl px-4 py-6 pb-16 sm:px-6 lg:px-8 lg:py-8"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
