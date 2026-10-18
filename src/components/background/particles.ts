/** 星空粒子：纯函数实现，便于单测与复用 */

export interface Star {
  x: number;
  y: number;
  r: number;
  base: number;
  phase: number;
  speed: number;
  warm: boolean;
}

/** 按视口宽度分档，低端设备减少粒子避免掉帧 */
export function pickStarCount(width: number): number {
  if (width < 640) return 90;
  if (width < 1024) return 160;
  return 240;
}

export function createStars(count: number, width: number, height: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: 0.4 + Math.random() * 1.2,
    base: 0.2 + Math.random() * 0.5,
    phase: Math.random() * Math.PI * 2,
    speed: 0.4 + Math.random() * 1.2,
    warm: Math.random() < 0.1,
  }));
}

/**
 * 绘制一帧。
 * 只做 clearRect + arc，不启用 shadow/filter，保证每帧开销可控。
 */
export function drawStars(
  ctx: CanvasRenderingContext2D,
  stars: Star[],
  width: number,
  height: number,
  time: number,
  opacity: number,
  color: string
): void {
  ctx.clearRect(0, 0, width, height);

  for (const star of stars) {
    const alpha = Math.max(
      0,
      Math.min(1, (star.base + Math.sin(time * star.speed + star.phase) * 0.18) * opacity)
    );
    ctx.globalAlpha = alpha;
    ctx.fillStyle = star.warm ? '#FFD54F' : color;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}
