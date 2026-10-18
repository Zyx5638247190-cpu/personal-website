import { cn } from '@/lib/cn';

type Tone = 'default' | 'danger';

/** 列表行图标按钮样式：编辑用 Link、删除用 button，共用同一套尺寸 */
export function iconActionClass(tone: Tone = 'default', className?: string): string {
  return cn(
    'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-card border border-transparent transition-colors',
    tone === 'danger'
      ? 'text-text-dim hover:border-red-400/40 hover:bg-red-500/10 hover:text-danger'
      : 'text-text-dim hover:border-border-strong hover:bg-surface-hover hover:text-primary-ink',
    className
  );
}
