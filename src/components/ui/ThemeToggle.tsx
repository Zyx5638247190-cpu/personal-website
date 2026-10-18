import { MoonIcon, SunIcon } from '@/components/icons';
import { useTheme } from '@/hooks/useTheme';

/** 主题切换：默认深色，点击后切浅色并由主题上下文持久化 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? '切换到浅色模式' : '切换到深色模式'}
      aria-pressed={isDark}
      title={isDark ? '切换到浅色模式' : '切换到深色模式'}
      className={[
        'inline-flex h-11 w-11 items-center justify-center rounded-full border border-border',
        'bg-surface/60 text-text-muted transition hover:border-border-strong hover:text-primary-ink',
        className ?? '',
      ].join(' ')}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
