import { ensureSeeded, simulate, STORAGE_KEYS } from './client';
import { SEED_EXPERIENCE } from './seed';
import type { Experience } from '@/types/models';

export const experienceApi = {
  /** 经历按时间倒序返回，最近的排在最前 */
  async list(): Promise<Experience[]> {
    return simulate(() => {
      const items = ensureSeeded(STORAGE_KEYS.experience, SEED_EXPERIENCE);
      return [...items].sort((a, b) => b.period.localeCompare(a.period));
    });
  },
};
