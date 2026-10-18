import type { SkillLevel } from '@/types/models';

/** 熟练度文案前后台共用，避免自评口径不一致 */
export const SKILL_LEVEL_LABEL: Record<SkillLevel, string> = {
  1: '了解',
  2: '入门',
  3: '熟练',
  4: '精通',
  5: '专家',
};

export const SKILL_LEVELS: SkillLevel[] = [1, 2, 3, 4, 5];
