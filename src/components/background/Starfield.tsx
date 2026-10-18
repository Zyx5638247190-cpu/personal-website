import { useEffect, useRef } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useTheme } from '@/hooks/useTheme';
import { createStars, drawStars, pickStarCount } from './particles';
import type { Star } from './particles';

/** 读取主题相关变量：浅色模式下星星更淡、偏暖 */
function readStarStyle(): { opacity: number; color: string } {
  const styles = getComputedStyle(document.documentElement);
  const opacity = Number(styles.getPropertyValue('--star-opacity').trim());
  const color = styles.getPropertyValue('--star-color').trim();
  return {
    opacity: Number.isFinite(opacity) && opacity > 0 ? opacity : 1,
    color: color || '#ffffff',
  };
}

/**
 * 星空背景：固定的 Canvas 层，位于内容之下。
 * 性能策略见 AGENTS.md 5.4：分档粒子、DPR 封顶、resize 防抖、后台暂停。
 */
export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let resizeTimer = 0;

    const setup = () => {
      // 高分屏按 3 倍渲染肉眼看不出差别，却多 125% 填充量
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = createStars(pickStarCount(width), width, height);
    };

    const drawOnce = (t = 0) => {
      const palette = readStarStyle();
      drawStars(ctx, stars, width, height, t, palette.opacity, palette.color);
    };

    const frame = (timestamp: number) => {
      drawOnce(timestamp / 1000);
      raf = window.requestAnimationFrame(frame);
    };

    const start = () => {
      window.cancelAnimationFrame(raf);
      setup();
      if (reduced) {
        // 减少动效：只画一帧静态星点
        drawOnce();
        return;
      }
      raf = window.requestAnimationFrame(frame);
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(start, 200);
    };

    const onVisibility = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(raf);
      } else if (!reduced) {
        raf = window.requestAnimationFrame(frame);
      }
    };

    start();
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduced, theme]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      style={{ contain: 'strict' }}
    >
      {/* 夜空底色与顶部暖光晕，canvas 只负责星点 */}
      <div className="absolute inset-0 bg-bg transition-colors duration-300" />
      <div className="starfield-halo absolute inset-x-0 top-0 h-[520px] opacity-70" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
