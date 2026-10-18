import {
  ApiError,
  clearCache,
  ensureSeeded,
  simulate,
  STORAGE_KEYS,
  writeJson,
} from './client';
import { SEED_SKILLS } from './seed';
import { toSlug } from '@/lib/slug';
import type { Skill, SkillGroup, SkillLevel } from '@/types/models';

/** 后台表单提交的形状：技能在存储里按分类分组，表单只关心单条 */
export interface SkillInput {
  category: string;
  name: string;
  icon: string;
  level: SkillLevel;
}

/** 拷贝一份分组，避免直接修改 ensureSeeded 返回的对象 */
function readGroups(): SkillGroup[] {
  return ensureSeeded(STORAGE_KEYS.skills, SEED_SKILLS).map((group) => ({
    ...group,
    items: group.items.map((item) => ({ ...item })),
  }));
}

function writeGroups(groups: SkillGroup[]): void {
  // 删空的分类不再保留，避免前台出现空卡片
  const cleaned = groups.filter((group) => group.items.length > 0);
  writeJson(STORAGE_KEYS.skills, cleaned);
  clearCache();
}

function validate(input: SkillInput): SkillInput {
  const category = input.category.trim();
  const name = input.name.trim();
  if (!category) throw new ApiError('分类不能为空', 'INVALID');
  if (!name) throw new ApiError('技能名称不能为空', 'INVALID');
  return {
    category,
    name,
    icon: input.icon.trim() || 'custom',
    level: input.level,
  };
}

/** 生成稳定且不重复的 id：优先用英文名，中文名退化为时间戳 */
function createId(name: string, groups: SkillGroup[]): string {
  const existing = new Set(groups.flatMap((group) => group.items.map((item) => item.id)));
  const base = toSlug(name) || `skill-${Date.now().toString(36)}`;
  let id = base;
  let suffix = 2;
  while (existing.has(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }
  return id;
}

function findSkill(groups: SkillGroup[], id: string): { group: SkillGroup; skill: Skill } | null {
  for (const group of groups) {
    const skill = group.items.find((item) => item.id === id);
    if (skill) return { group, skill };
  }
  return null;
}

export const skillsApi = {
  /** 技能按分类返回，顺序即为展示顺序 */
  async list(): Promise<SkillGroup[]> {
    return simulate(() => ensureSeeded(STORAGE_KEYS.skills, SEED_SKILLS));
  },

  async create(input: SkillInput): Promise<Skill> {
    return simulate(() => {
      const data = validate(input);
      const groups = readGroups();
      const skill: Skill = {
        id: createId(data.name, groups),
        name: data.name,
        icon: data.icon,
        level: data.level,
      };

      const target = groups.find((group) => group.category === data.category);
      if (target) target.items.push(skill);
      else groups.push({ category: data.category, items: [skill] });

      writeGroups(groups);
      return skill;
    });
  },

  /** 编辑技能：支持同时改分类，相当于把它移动到另一个分组末尾 */
  async update(id: string, input: SkillInput): Promise<Skill> {
    return simulate(() => {
      const data = validate(input);
      const groups = readGroups();
      const found = findSkill(groups, id);
      if (!found) throw new ApiError(`技能 ${id} 不存在`, 'NOT_FOUND');

      const updated: Skill = {
        id: found.skill.id,
        name: data.name,
        icon: data.icon,
        level: data.level,
      };

      found.group.items = found.group.items.filter((item) => item.id !== id);
      const target = groups.find((group) => group.category === data.category);
      if (target) target.items.push(updated);
      else groups.push({ category: data.category, items: [updated] });

      writeGroups(groups);
      return updated;
    });
  },

  async remove(id: string): Promise<void> {
    return simulate(() => {
      const groups = readGroups();
      const found = findSkill(groups, id);
      if (!found) throw new ApiError(`技能 ${id} 不存在`, 'NOT_FOUND');

      found.group.items = found.group.items.filter((item) => item.id !== id);
      writeGroups(groups);
    });
  },
};
