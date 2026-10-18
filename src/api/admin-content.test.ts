import { beforeEach, describe, expect, it } from 'vitest';
import { adminApi } from './admin';
import { clearCache } from './client';
import { postsApi } from './posts';
import { profileApi } from './profile';
import { projectsApi } from './projects';
import { skillsApi } from './skills';
import { SEED_POSTS, SEED_PROJECTS } from './seed';
import type { Post, Project } from '@/types/models';

/** 测试用项目：字段最小但覆盖类型要求 */
const TEST_PROJECT: Project = {
  slug: 'admin-test-project',
  title: '后台测试项目',
  summary: '只用于单元测试。',
  tags: ['React'],
  links: {},
  date: '2026-10',
  status: 'wip',
  featured: false,
};

function createTestPost(overrides: Partial<Post> = {}): Post {
  return {
    slug: 'admin-test-post',
    title: '后台测试文章',
    summary: '只用于单元测试。',
    content: '第一段。\n\n第二段。',
    date: '2026-10-18',
    tags: ['测试'],
    readingTime: 1,
    draft: true,
    ...overrides,
  };
}

/**
 * 后台所有写操作最终都要反映到前台的读取接口。
 * 这里直接测 API 层，覆盖「新增 → 前台可见 → 修改 → 删除」的完整链路。
 */
describe('后台内容管理接口', () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearCache();
  });

  it('新建项目后前台列表立即读到，删除后立即消失', async () => {
    // 先读一次，让列表进入 60 秒缓存，验证写操作会主动失效缓存
    await projectsApi.list({ status: 'all' });
    await projectsApi.create(TEST_PROJECT);

    const afterCreate = await projectsApi.list({ status: 'all' });
    expect(afterCreate.some((item) => item.slug === TEST_PROJECT.slug)).toBe(true);

    await projectsApi.remove(TEST_PROJECT.slug);
    const afterDelete = await projectsApi.list({ status: 'all' });
    expect(afterDelete.some((item) => item.slug === TEST_PROJECT.slug)).toBe(false);
  });

  it('项目 slug 重复或格式非法时给出可读的校验错误', async () => {
    await expect(projectsApi.create({ ...TEST_PROJECT, slug: 'Invalid Slug' })).rejects.toThrow(
      '链接标识只能使用小写字母、数字和连字符'
    );
    await expect(
      projectsApi.create({ ...TEST_PROJECT, slug: SEED_PROJECTS[0]!.slug })
    ).rejects.toThrow('这个链接标识已经被占用了');
  });

  it('草稿不出现在前台列表，发布后出现并自动计算阅读时长', async () => {
    const draft = createTestPost();
    await postsApi.create(draft);

    expect((await postsApi.list()).items.some((item) => item.slug === draft.slug)).toBe(false);

    const saved = await postsApi.update(draft.slug, { ...draft, draft: false });
    expect(saved.readingTime).toBeGreaterThanOrEqual(1);

    const published = await postsApi.list();
    expect(published.items.some((item) => item.slug === draft.slug)).toBe(true);
  });

  it('技能支持改分类改名称，删空后的分类不会再回到前台', async () => {
    await skillsApi.create({ category: '测试', name: 'Playwright', icon: 'custom', level: 4 });

    const before = await skillsApi.list();
    expect(before.find((group) => group.category === '测试')?.items[0]?.name).toBe('Playwright');

    await skillsApi.update('playwright', {
      category: '测试',
      name: 'Vitest',
      icon: 'custom',
      level: 5,
    });

    const after = await skillsApi.list();
    expect(after.find((group) => group.category === '测试')?.items[0]?.name).toBe('Vitest');

    await skillsApi.remove('playwright');
    expect((await skillsApi.list()).some((group) => group.category === '测试')).toBe(false);
  });

  it('个人信息保存后立即生效，空名字会被拒绝', async () => {
    const profile = await profileApi.get();
    await profileApi.update({ ...profile, name: '测试奶龙' });

    expect((await profileApi.get()).name).toBe('测试奶龙');
    await expect(profileApi.update({ ...profile, name: '   ' })).rejects.toThrow('名字不能为空');
  });

  it('仪表盘统计与种子数据一致，并能反映新增内容', async () => {
    const before = await adminApi.overview();

    expect(before.projects).toBe(SEED_PROJECTS.length);
    expect(before.posts).toBe(SEED_POSTS.length);
    expect(before.skills).toBe(11);

    await projectsApi.create(TEST_PROJECT);
    await postsApi.create(createTestPost());

    const after = await adminApi.overview();
    expect(after.projects).toBe(before.projects + 1);
    expect(after.posts).toBe(before.posts + 1);
    expect(after.drafts).toBe(before.drafts + 1);
  });
});
