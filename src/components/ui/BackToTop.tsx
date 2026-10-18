import { useEffect, useState } from 'react';
import { ArrowUpIcon } from '@/components/icons';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';

/**
 * 回到顶部：滚动超过 600px 出现。
 * scroll 事件用 rAF 合并，避免高频 setState；减少动效时直接跳转。
 */
export function BackToTop() {
  const [visible, setVisible] = useState(() => window.scrollY > 600);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      setVisible(window.scrollY > 600);
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="回到顶部"
      aria-hidden={visible ? undefined : true}
      tabIndex={visible ? 0 : -1}
      title="回到顶部"
      className={cn(
        'fixed right-5 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full',
        'bg-primary-gradient text-primary-contrast shadow-lg transition-all duration-300',
        'hover:brightness-105',
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0'
      )}
      style={{ bottom: 'calc(20px + env(safe-area-inset-bottom))' }}
    >
      <ArrowUpIcon />
    </button>
  );
}
