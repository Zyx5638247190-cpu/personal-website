import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { getStoredTheme, setStoredTheme } from '@/api/preferences';
import { ThemeContext } from './theme-context';
import type { Theme } from '@/types/models';

/**
 * 主题状态：初始值直接读 <html data-theme>，该属性已由 index.html 的内联脚本写好，
 * 因此首帧不会闪白。不要在 effect 里做首次赋值。
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const fromDom = document.documentElement.dataset.theme;
    return fromDom === 'light' || fromDom === 'dark' ? fromDom : getStoredTheme();
  });

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.dataset.theme = next;
    setStoredTheme(next);
    setThemeState(next);
  }, []);

  const toggle = useCallback(() => {
    setThemeState((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      setStoredTheme(next);
      return next;
    });
  }, []);

  // 多标签页同步：另一个标签改了主题时，这边跟着变
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== 'nd:theme') return;
      if (event.newValue === 'dark' || event.newValue === 'light') {
        document.documentElement.dataset.theme = event.newValue;
        setThemeState(event.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo(() => ({ theme, toggle, setTheme }), [theme, toggle, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
