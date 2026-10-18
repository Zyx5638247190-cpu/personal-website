import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface TagProps {
  children: ReactNode;
  active?: boolean;
  className?: string;
}

/** 技术标签：卡片内外统一的 8px 小圆角 */
export function Tag({ children, active = false, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-card border px-2.5 py-1 text-xs leading-none',
        active
          ? 'border-primary-500/50 bg-primary-500/15 text-primary-ink'
          : 'border-border bg-surface/60 text-text-muted',
        className
      )}
    >
      {children}
    </span>
  );
}
