/** 统一日期展示格式：2026-09-12 → 2026.09.12 */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

/** 按中文字符估算阅读时长，至少 1 分钟 */
export function estimateReadingTime(text: string): number {
  const chinese = (text.match(/[\u4e00-\u9fa5]/g) ?? []).length;
  const words = text.replace(/[\u4e00-\u9fa5]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(chinese / 350 + words / 200));
}
