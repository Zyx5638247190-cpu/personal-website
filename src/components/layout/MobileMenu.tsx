import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { NAV_SECTIONS } from '@/config';
import { DragonMascot } from '@/components/mascot/DragonMascot';
import { CloseIcon, GithubIcon, MailIcon } from '@/components/icons';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SITE } from '@/config';
import { cn } from '@/lib/cn';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  isHome: boolean;
  activeId: string;
}

/**
 * 移动端全屏抽屉：打开时锁定页面滚动、焦点移入、Esc 关闭。
 * 背景用半透明 + 模糊，保留星空氛围。
 */
export function MobileMenu({ open, onClose, isHome, activeId }: MobileMenuProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    // 打开后把焦点交给关闭按钮，键盘用户不必再 Tab 一遍导航
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="移动端导航"
      className="fixed inset-0 z-[60] flex flex-col bg-bg/95 backdrop-blur-xl lg:hidden"
    >
      <div className="container-page flex h-[72px] shrink-0 items-center justify-between">
        <div className="flex items-center gap-2.5 text-base font-semibold">
          <DragonMascot size={32} headOnly animated={false} />
          奶龙小站
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="关闭菜单"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/60 text-text"
        >
          <CloseIcon />
        </button>
      </div>

      <nav aria-label="移动端主导航" className="container-page flex-1 overflow-y-auto py-6">
        <ul className="space-y-1">
          {NAV_SECTIONS.map((section, index) => {
            const isActive = isHome && activeId === section.id;
            return (
              <li key={section.id}>
                <Link
                  to={`/#${section.id}`}
                  onClick={onClose}
                  className={cn(
                    'flex items-center justify-between rounded-card px-4 py-4 text-lg transition-colors',
                    isActive
                      ? 'bg-primary-500/10 text-primary-ink'
                      : 'text-text hover:bg-surface'
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <span>{section.label}</span>
                  <span className="text-sm text-text-dim">0{index + 1}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex items-center justify-between rounded-card border border-border bg-surface/60 p-4">
          <span className="text-sm text-text-muted">换个模式看看？</span>
          <ThemeToggle />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`mailto:${SITE.email}`}
            className="inline-flex items-center gap-2 rounded-button border border-border px-4 py-2.5 text-sm text-text-muted"
          >
            <MailIcon /> 邮件
          </a>
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-button border border-border px-4 py-2.5 text-sm text-text-muted"
          >
            <GithubIcon /> GitHub
          </a>
        </div>
      </nav>
    </div>
  );
}
