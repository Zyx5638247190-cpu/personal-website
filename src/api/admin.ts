import { ensureSeeded, simulate, STORAGE_KEYS } from './client';
import { SEED_POSTS, SEED_PROJECTS, SEED_SKILLS } from './seed';
import type { PostSummary } from '@/types/models';

export interface AdminOverview {
  projects: number;
  posts: number;
  drafts: number;
  skills: number;
  recentPosts: PostSummary[];
}

/** 仪表盘统计：一次读完三类数据，避免页面自己拼装存储逻辑 */
export const adminApi = {
  async overview(): Promise<AdminOverview> {
    return simulate(() => {
      const projects = ensureSeeded(STORAGE_KEYS.projects, SEED_PROJECTS);
      const posts = ensureSeeded(STORAGE_KEYS.posts, SEED_POSTS);
      const skills = ensureSeeded(STORAGE_KEYS.skills, SEED_SKILLS);

      const recentPosts = [...posts]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 3)
        .map(({ content: _content, ...summary }) => summary);

      return {
        projects: projects.length,
        posts: posts.length,
        drafts: posts.filter((post) => post.draft).length,
        skills: skills.reduce((total, group) => total + group.items.length, 0),
        recentPosts,
      };
    });
  },
};
