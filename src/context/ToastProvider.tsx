import { useCallback, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ToastContext } from './toast-context';
import type { ToastTone } from './toast-context';

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

const TOAST_DURATION = 2200;

/** 轻量提示：同屏最多 3 条，2.2s 后自动消失 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const toast = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = nextId.current++;
    setItems((current) => [...current.slice(-2), { id, message, tone }]);
    window.setTimeout(() => {
      setItems((current) => current.filter((item) => item.id !== id));
    }, TOAST_DURATION);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex flex-col items-center gap-2 px-6 sm:bottom-8"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={[
              'rounded-button border px-4 py-2 text-sm shadow-lg backdrop-blur',
              item.tone === 'error'
                ? 'border-red-400/40 bg-red-500/15 text-danger'
                : 'border-primary-500/40 bg-surface/90 text-text',
            ].join(' ')}
          >
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
