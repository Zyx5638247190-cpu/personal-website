/**
 * 数据层基础工具：localStorage 的唯一出入口。
 * 页面与组件必须通过 api/* 访问数据，禁止直接调用这里以外的存储 API。
 */

// 内容版本号：种子内容（如站主名字）变更时递增，让浏览器里缓存的旧文案自动失效
const PREFIX = 'nd:v2';

export const STORAGE_KEYS = {
  meta: `${PREFIX}:meta`,
  profile: `${PREFIX}:profile`,
  skills: `${PREFIX}:skills`,
  experience: `${PREFIX}:experience`,
  projects: `${PREFIX}:projects`,
  posts: `${PREFIX}:posts`,
} as const;

export type ApiErrorCode = 'NOT_FOUND' | 'STORAGE' | 'INVALID';

export class ApiError extends Error {
  readonly code: ApiErrorCode;

  constructor(message: string, code: ApiErrorCode = 'NOT_FOUND') {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

/** 模拟网络延迟，让页面必须处理 loading 状态，未来接真实接口时无需改页面 */
const delay = (ms = 120 + Math.random() * 180): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

let usable: boolean | null = null;
const memory = new Map<string, string>();

/** 检测存储可用性：隐私模式或配额满时降级到内存，站点仍能正常展示 */
export function storageAvailable(): boolean {
  if (usable !== null) return usable;
  try {
    const probe = '__nd_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    usable = true;
  } catch {
    usable = false;
  }
  return usable;
}

export function readStored(key: string): string | null {
  try {
    if (storageAvailable()) return window.localStorage.getItem(key);
    return memory.get(key) ?? null;
  } catch {
    return null;
  }
}

export function writeStored(key: string, value: string): void {
  try {
    if (storageAvailable()) window.localStorage.setItem(key, value);
    else memory.set(key, value);
  } catch {
    throw new ApiError('本地存储写入失败，可能是空间已满', 'STORAGE');
  }
}

/** 删除一个键；退出登录、清理过期会话时使用 */
export function removeStored(key: string): void {
  try {
    if (storageAvailable()) window.localStorage.removeItem(key);
    else memory.delete(key);
  } catch {
    // 存储不可用时没有可清理的数据，静默忽略
  }
}

/** 读取 JSON，损坏时回退到 fallback，避免一个坏值让整页白屏 */
export function readJson<T>(key: string, fallback: T): T {
  const raw = readStored(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    console.warn(`[api] ${key} 解析失败，已回退到种子数据`);
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  try {
    writeStored(key, JSON.stringify(value));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('数据序列化失败', 'INVALID');
  }
}

/** 首次访问自动写入种子数据；用户清空缓存后也能恢复 */
export function ensureSeeded<T>(key: string, seed: T): T {
  const existing = readJson<T | null>(key, null);
  if (existing !== null) return existing;
  writeJson(key, seed);
  return seed;
}

/** 返回 Promise 前统一加延迟，保持接口形状与真实后端一致 */
export async function simulate<T>(producer: () => T): Promise<T> {
  await delay();
  return producer();
}

// 列表数据在内存中缓存 60 秒，减少重复读取造成的闪烁
const cache = new Map<string, { at: number; value: unknown }>();

export function cached<T>(key: string, ttlMs: number, load: () => T): T {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < ttlMs) return hit.value as T;
  const value = load();
  cache.set(key, { at: Date.now(), value });
  return value;
}

/**
 * 清空列表缓存。后台增删改后必须调用，否则前台在 60 秒 TTL 内仍会读到旧列表。
 */
export function clearCache(): void {
  cache.clear();
}
