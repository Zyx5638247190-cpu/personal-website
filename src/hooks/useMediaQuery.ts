import { useCallback, useSyncExternalStore } from 'react';

/**
 * 监听 CSS 媒体查询。
 * 用 useSyncExternalStore 而不是 effect + state，避免首帧读到错误的初始值。
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    },
    [query]
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
