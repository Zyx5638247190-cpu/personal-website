import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from '@/components/icons';
import { cn } from '@/lib/cn';

type DialogSize = 'sm' | 'md' | 'lg';

const SIZE_CLASS: Record<DialogSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
};

interface DialogProps {
  open: boolean;
  title: string;
  description?: string;
  size?: DialogSize;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * 后台通用弹窗：Portal 到 body，避免被侧栏的层叠上下文裁掉。
 * 打开时锁定页面滚动、Esc 关闭、Tab 在弹窗内循环，关闭后把焦点还给触发元素。
 */
export function Dialog({
  open,
  title,
  description,
  size = 'md',
  onClose,
  children,
  footer,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    // 在 autoFocus 生效之前记录触发元素：清理时把焦点还回去，键盘用户不会丢失位置
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 等弹窗挂载后再聚焦：优先带 data-autofocus 的控件（如「再想想」），否则聚焦面板。
    // 用属性而不是原生 autoFocus，是为了避免提交阶段抢焦点，导致上面的 previousFocus 记错元素。
    const focusTimer = window.setTimeout(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const preferred = panel.querySelector<HTMLElement>('[data-autofocus]');
      (preferred ?? panel).focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;

      // 焦点循环：把 Tab 限制在弹窗内，避免读到被遮住的后台内容
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        // 只有点在遮罩本身才关闭，点弹窗内部不触发
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-card border border-border bg-surface dialog-surface outline-none',
          SIZE_CLASS[size]
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div className="space-y-1">
            <h2 id={titleId} className="text-base font-semibold text-text">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="text-sm text-text-muted">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭弹窗"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-text-muted transition hover:border-border-strong hover:text-text"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">{children}</div>

        {footer ? (
          <footer className="flex flex-col-reverse gap-3 border-t border-border p-5 pb-[max(20px,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>,
    document.body
  );
}
