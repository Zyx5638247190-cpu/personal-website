import { useEffect, useRef, useState } from 'react';
import type { SkillLevel } from '@/types/models';

interface SkillMeterProps {
  name: string;
  level: SkillLevel;
  /** 同组内逐项递增，形成从左到右依次点亮的节奏 */
  delay?: number;
}

const SEGMENTS = [1, 2, 3, 4, 5] as const;

/**
 * 5 段式熟练度：进入视口后一次性填充，之后不再重播。
 * 用 transform 而不是 width 做动画，避免触发布局。
 */
export function SkillMeter({ name, level, delay = 0 }: SkillMeterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [filled, setFilled] = useState(
    () =>
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (filled) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setFilled(true);
            observer.unobserve(node);
          }
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [filled]);

  return (
    <div
      ref={ref}
      role="meter"
      aria-valuemin={1}
      aria-valuemax={5}
      aria-valuenow={level}
      aria-label={`${name} 熟练度 ${level}/5`}
      className="mt-1.5 flex gap-1"
    >
      {SEGMENTS.map((segment) => {
        const isActive = segment <= level;
        return (
          <span
            key={segment}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-hover"
          >
            <span
              className="block h-full w-full origin-left bg-primary-gradient transition-transform duration-[600ms] ease-out"
              style={{
                transform: filled && isActive ? 'scaleX(1)' : 'scaleX(0)',
                transitionDelay: `${(segment - 1) * 60 + delay}ms`,
              }}
            />
          </span>
        );
      })}
    </div>
  );
}
