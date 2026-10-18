import { useEffect, useId, useRef } from 'react';
import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import type { Mood } from '@/types/models';
import './mascot.css';

type MascotSize = 'xs' | 'sm' | 'md' | 'lg';

const SIZE_PX: Record<MascotSize, number> = {
  xs: 36,
  sm: 72,
  md: 160,
  lg: 280,
};

interface DragonMascotProps {
  size?: MascotSize | number;
  mood?: Mood;
  /** 关闭动画（减少动效偏好会自动关闭） */
  animated?: boolean;
  /** 眼神跟随鼠标，仅 Hero 使用 */
  followCursor?: boolean;
  /** 只渲染头部，用于 32–40px 的 Logo */
  headOnly?: boolean;
  className?: string;
  title?: string;
}

/** 抱在手里的五角星路径（固定坐标，避免每次渲染重复计算） */
const STAR_PATH =
  'M160 34 L164.2 44.4 L175.4 45.3 L166.9 52.6 L169.5 63.6 L160 57.7 L150.5 63.6 L153.1 52.6 L144.6 45.3 L155.8 44.4 Z';

const MOUTH: Record<Mood, string> = {
  happy: 'M89 99 Q100 111 111 99',
  sleepy: 'M94 102 Q100 107 106 102',
  curious: 'M96 102 Q100 106 104 102',
  sad: 'M91 108 Q100 100 109 108',
  celebrate: 'M89 98 Q100 116 111 98',
};

/**
 * 奶龙吉祥物：纯内联 SVG。
 * 表情通过眼睛/嘴部路径切换，不加载任何外部图片。
 */
export function DragonMascot({
  size = 'md',
  mood = 'happy',
  animated = true,
  followCursor = false,
  headOnly = false,
  className,
  title,
}: DragonMascotProps) {
  const rawId = useId();
  // useId 含冒号，放进 SVG id 会在 url(#...) 里出问题，先清理
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');
  const bodyGradient = `${uid}-body`;
  const px = typeof size === 'number' ? size : SIZE_PX[size];
  const svgRef = useRef<SVGSVGElement>(null);
  const isSleepy = mood === 'sleepy';
  const isCelebrate = mood === 'celebrate';
  const isSad = mood === 'sad';

  // 眼神跟随：节流到每帧一次，只写 CSS 变量，不逐帧改 SVG 属性
  useEffect(() => {
    const node = svgRef.current;
    if (!followCursor || !node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;

    const apply = () => {
      raf = 0;
      node.style.setProperty('--look-x', targetX.toFixed(2));
      node.style.setProperty('--look-y', targetY.toFixed(2));
    };

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const rawX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const rawY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      targetX = Math.max(-1, Math.min(1, rawX));
      targetY = Math.max(-1, Math.min(1, rawY));
      if (!raf) raf = window.requestAnimationFrame(apply);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.cancelAnimationFrame(raf);
    };
  }, [followCursor]);

  return (
    <svg
      ref={svgRef}
      width={px}
      height={px}
      viewBox={headOnly ? '44 20 112 118' : '0 0 200 200'}
      className={cn('mascot', animated && 'mascot--animated', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      style={{ '--look-x': 0, '--look-y': 0 } as CSSProperties}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={bodyGradient} x1="30%" y1="10%" x2="70%" y2="90%">
          <stop offset="0%" stopColor="#FFD54F" />
          <stop offset="100%" stopColor="#FFCA28" />
        </linearGradient>
      </defs>

      <g className="mascot-inner">
        {!headOnly && (
          <>
            {/* 尾巴：先画在身体后面，摆动只旋转尾巴组 */}
            <g className="mascot-tail">
              <path
                d="M62 152 C40 158 26 143 34 129"
                fill="none"
                stroke="#FFCA28"
                strokeWidth="15"
                strokeLinecap="round"
              />
              <path
                d="M62 152 C40 158 26 143 34 129"
                fill="none"
                stroke="#C98A00"
                strokeWidth="15"
                strokeLinecap="round"
                opacity="0.28"
              />
            </g>

            {/* 脚 */}
            <ellipse cx="78" cy="173" rx="16" ry="9" fill="#FFD54F" stroke="#C98A00" strokeWidth="3" />
            <ellipse cx="122" cy="173" rx="16" ry="9" fill="#FFD54F" stroke="#C98A00" strokeWidth="3" />

            {/* 身体与肚皮 */}
            <ellipse cx="100" cy="132" rx="54" ry="44" fill={`url(#${bodyGradient})`} stroke="#C98A00" strokeWidth="3" />
            <ellipse cx="100" cy="143" rx="33" ry="25" fill="#FFE082" />

            {/* 手臂 */}
            <ellipse
              cx="52"
              cy="126"
              rx="11"
              ry="17"
              fill="#FFCA28"
              stroke="#C98A00"
              strokeWidth="3"
              transform="rotate(-18 52 126)"
            />
            <ellipse
              cx="148"
              cy="126"
              rx="11"
              ry="17"
              fill="#FFCA28"
              stroke="#C98A00"
              strokeWidth="3"
              transform="rotate(18 148 126)"
            />

            {/* 漂浮的小星星，呼应「奶龙抱星星」的设定 */}
            <g className="mascot-star">
              <path d={STAR_PATH} fill="#FFD54F" stroke="#FFB300" strokeWidth="3" strokeLinejoin="round" />
            </g>
          </>
        )}

        {/* 犄角在头部之前渲染，形成被头挡住的效果 */}
        <path d="M74 48 Q76 28 90 33 Q86 44 82 52 Z" fill="#FFB300" stroke="#C98A00" strokeWidth="3" strokeLinejoin="round" />
        <path d="M126 48 Q124 28 110 33 Q114 44 118 52 Z" fill="#FFB300" stroke="#C98A00" strokeWidth="3" strokeLinejoin="round" />

        {/* 头 */}
        <circle cx="100" cy="82" r="46" fill={`url(#${bodyGradient})`} stroke="#C98A00" strokeWidth="3" />

        {/* 眼睛：整组做眨眼缩放，睡眠时换成弧线 */}
        <g className="mascot-eyes">
          {(isSleepy || isCelebrate) ? (
            <>
              <path
                d={isCelebrate ? 'M72 85 Q83 72 94 85' : 'M72 82 Q83 92 94 82'}
                fill="none"
                stroke="#2A2A33"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d={isCelebrate ? 'M106 85 Q117 72 128 85' : 'M106 82 Q117 92 128 82'}
                fill="none"
                stroke="#2A2A33"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </>
          ) : (
            <>
              <g className="mascot-pupils">
                <circle cx="83" cy="82" r="11" fill="#2A2A33" />
                <circle cx="117" cy="82" r="11" fill="#2A2A33" />
                <circle cx="86.5" cy="78" r="3.6" fill="#FFFFFF" />
                <circle cx="120.5" cy="78" r="3.6" fill="#FFFFFF" />
              </g>
              {isSad && (
                <>
                  <path d="M72 68 L93 74" stroke="#C98A00" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M128 68 L107 74" stroke="#C98A00" strokeWidth="3.5" strokeLinecap="round" />
                </>
              )}
            </>
          )}
        </g>

        {/* 腮红 */}
        <ellipse cx="67" cy="98" rx="8" ry="4.5" fill="#FF9E3D" opacity="0.35" />
        <ellipse cx="133" cy="98" rx="8" ry="4.5" fill="#FF9E3D" opacity="0.35" />

        {/* 嘴：celebrate 时是张嘴，其余为路径 */}
        {isCelebrate ? (
          <g>
            <ellipse cx="100" cy="106" rx="9" ry="10" fill="#C98A00" />
            <ellipse cx="100" cy="110" rx="4.5" ry="4" fill="#FF9E9E" />
          </g>
        ) : (
          <path
            d={MOUTH[mood]}
            fill="none"
            stroke="#C98A00"
            strokeWidth="4"
            strokeLinecap="round"
          />
        )}
      </g>
    </svg>
  );
}
