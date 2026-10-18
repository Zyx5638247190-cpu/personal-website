/**
 * 轻量类名拼接：过滤 false/null/undefined。
 * 不引入 clsx 之类的依赖，保持包体积。
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
