/** 统一把接口异常变成可以给用户看的一句话 */
export function errorMessage(error: unknown, fallback = '奶龙没保存成功，再试一次？'): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
