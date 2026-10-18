import {
  ApiError,
  cached,
  clearCache,
  ensureSeeded,
  simulate,
  STORAGE_KEYS,
  writeJson,
} from './client';
import { SEED_PROJECTS } from './seed';
import { isValidSlug } from '@/lib/slug';
import type { Project, ProjectStatus } from '@/types/models';

export interface ProjectQuery {
  status?: ProjectStatus | 'all';
}

/** 精选优先、时间倒序，同权重按 order 兜底 */
function sortProjects(items: Project[]): Project[] {
  return [...items].sort(
    (a, b) =>
      Number(b.featured) - Number(a.featured) ||
      (a.order ?? 99) - (b.order ?? 99) ||
      b.date.localeCompare(a.date)
  );
}

function readProjects(): Project[] {
  return ensureSeeded(STORAGE_KEYS.projects, SEED_PROJECTS).map((item) => ({ ...item }));
}

function writeProjects(items: Project[]): void {
  writeJson(STORAGE_KEYS.projects, items);
  // 前台项目列表有 60s 缓存，写入后必须失效
  clearCache();
}

/** 表单校验集中在这里，保证后台和未来真实接口的行为一致 */
function validate(project: Project, all: Project[], originalSlug?: string): Project {
  const slug = project.slug.trim();
  const title = project.title.trim();
  const date = project.date.trim();

  if (!title) throw new ApiError('标题不能为空', 'INVALID');
  if (!slug) throw new ApiError('链接标识不能为空', 'INVALID');
  if (!isValidSlug(slug)) {
    throw new ApiError('链接标识只能使用小写字母、数字和连字符', 'INVALID');
  }
  if (!date) throw new ApiError('日期不能为空', 'INVALID');
  if (all.some((item) => item.slug === slug && item.slug !== originalSlug)) {
    throw new ApiError('这个链接标识已经被占用了', 'INVALID');
  }

  return {
    ...project,
    slug,
    title,
    date,
    summary: project.summary.trim(),
    content: project.content?.trim() || undefined,
    tags: project.tags.map((tag) => tag.trim()).filter(Boolean),
  };
}

export const projectsApi = {
  async list(params: ProjectQuery = {}): Promise<Project[]> {
    const status = params.status ?? 'all';
    return simulate(() =>
      cached(`projects:${status}`, 60_000, () => {
        const all = readProjects();
        const filtered =
          status === 'all' ? all : all.filter((item) => item.status === status);
        return sortProjects(filtered);
      })
    );
  },

  /** 详情页用：查不到时抛 NOT_FOUND，由页面渲染奶龙 404 区块 */
  async getBySlug(slug: string): Promise<Project> {
    return simulate(() => {
      const found = readProjects().find((item) => item.slug === slug);
      if (!found) throw new ApiError(`项目 ${slug} 不存在`, 'NOT_FOUND');
      return found;
    });
  },

  async create(project: Project): Promise<Project> {
    return simulate(() => {
      const all = readProjects();
      const saved = validate(project, all);
      writeProjects([...all, saved]);
      return saved;
    });
  },

  /** 编辑项目：slug 允许修改，但要检查是否与其他项目冲突 */
  async update(originalSlug: string, project: Project): Promise<Project> {
    return simulate(() => {
      const all = readProjects();
      const index = all.findIndex((item) => item.slug === originalSlug);
      if (index < 0) throw new ApiError(`项目 ${originalSlug} 不存在`, 'NOT_FOUND');

      const saved = validate(project, all, originalSlug);
      all[index] = saved;
      writeProjects(all);
      return saved;
    });
  },

  async remove(slug: string): Promise<void> {
    return simulate(() => {
      const all = readProjects();
      if (!all.some((item) => item.slug === slug)) {
        throw new ApiError(`项目 ${slug} 不存在`, 'NOT_FOUND');
      }
      writeProjects(all.filter((item) => item.slug !== slug));
    });
  },
};
