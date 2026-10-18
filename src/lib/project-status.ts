import type { ProjectStatus } from '@/types/models';

/** 项目状态在前台卡片、筛选器和后台列表中共用，避免两套文案漂移 */
export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  featured: '精选',
  wip: '进行中',
  archived: '已归档',
};

export const PROJECT_STATUS_STYLE: Record<ProjectStatus, string> = {
  featured: 'border-primary-500/50 bg-primary-500/15 text-primary-ink',
  wip: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
  archived: 'border-border bg-surface/70 text-text-dim',
};

export const PROJECT_STATUS_FILTERS: Array<{ value: ProjectStatus | 'all'; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'featured', label: '精选' },
  { value: 'wip', label: '进行中' },
  { value: 'archived', label: '已归档' },
];
