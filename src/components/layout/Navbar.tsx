import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_SECTIONS } from '@/config';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { DragonMascot } from '@/components/mascot/DragonMascot';
import { MenuIcon } from '@/components/icons';
import { MobileMenu } from './MobileMenu';
import { cn } from '@/lib/cn';

/**
 * 吸顶导航：滚动超过 24px 后加毛玻璃与描边。
 * 锚点高亮用 IntersectionObserver，避免监听 scroll 频繁计算位置。
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('home');
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 只有首页有这些区块，其他页面不做高亮
  useEffect(() => {
    if (!isHome) return;
    const nodes = NAV_SECTIONS.map((section) => document.getElementById(section.id)).filter(
      (node): node is HTMLElement => node !== null
    );
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [isHome, location.pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
          scrolled
            ? 'border-b border-border bg-bg/70 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        )}
      >
        <div className="container-page flex h-[72px] items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-base font-semibold text-text"
            aria-label="回到首页"
          >
            <DragonMascot size={34} headOnly animated={false} />
            <span className="tracking-tight">奶龙小站</span>
          </Link>

          <nav aria-label="主导航" className="hidden items-center gap-1 lg:flex">
            {NAV_SECTIONS.map((section) => {
              const isActive = isHome && activeId === section.id;
              return (
                <Link
                  key={section.id}
                  to={`/#${section.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive ? 'text-primary-ink' : 'text-text-muted hover:text-text'
                  )}
                >
                  {section.label}
                  {isActive ? (
                    <span className="absolute inset-x-3 -bottom-px h-px bg-primary-gradient" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link
              to="/#contact"
              className="hidden h-11 items-center justify-center rounded-button bg-primary-gradient px-5 text-sm font-medium text-primary-contrast transition hover:brightness-105 sm:inline-flex"
            >
              联系我
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="打开菜单"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/60 text-text lg:hidden"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        isHome={isHome}
        activeId={activeId}
      />
    </>
  );
}
