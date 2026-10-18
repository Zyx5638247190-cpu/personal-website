import {
  ApiError,
  clearCache,
  ensureSeeded,
  simulate,
  STORAGE_KEYS,
  writeJson,
} from './client';
import { SEED_PROFILE } from './seed';
import type { Profile } from '@/types/models';

export const profileApi = {
  /** 读取个人信息；首次访问自动写入种子数据 */
  async get(): Promise<Profile> {
    return simulate(() => ensureSeeded(STORAGE_KEYS.profile, SEED_PROFILE));
  },

  /** 后台保存个人信息：姓名为首屏必填项，空值会让 Hero 出现空白 */
  async update(next: Profile): Promise<Profile> {
    return simulate(() => {
      const name = next.name.trim();
      if (!name) throw new ApiError('名字不能为空', 'INVALID');

      const saved: Profile = { ...next, name };
      writeJson(STORAGE_KEYS.profile, saved);
      clearCache();
      return saved;
    });
  },
};
