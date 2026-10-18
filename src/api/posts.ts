import {
  ApiError,
  cached,
  clearCache,
  ensureSeeded,
  simulate,
  STORAGE_KEYS,
  writeJson,
} from './client';
import { SEED_POSTS } from './seed';
import { estimateReadingTime } from '@/lib/date';
import { isValidSlug } from '@/lib/slug';
import type { Post, PostSummary } from '@/types/models';

export interface PostQuery {
  tag?: string;
  page?: number;
  pageSize?: number;
}

export interface PostListResult {
  items: PostSummary[];
  total: number;
  hasMore: boolean;
}

/** 列表只返回摘要字段，正文留给详情接口 */
function toSummary(post: Post): PostSummary {
  const { content: _content, ...rest } = post;
  return rest;
}

function readPosts(): Post[] {
  return ensureSeeded(STORAGE_KEYS.posts, SEED_POSTS).map((post) => ({ ...post }));
}

function writePosts(posts: Post[]): void {
  writeJson(STORAGE_KEYS.posts, posts);
  // 前台博客列表有 60s 缓存，写入后必须失效
  clearCache();
}

function publishedPosts(): Post[] {
  return readPosts()
    .filter((post) => !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** 表单校验：草稿允许正文为空，正式文章必须写点东西 */
function validate(post: Post, all: Post[], originalSlug?: string): Post {
  const slug = post.slug.trim();
  const title = post.title.trim();
  const date = post.date.trim();
  const content = post.content.trim();

  if (!title) throw new ApiError('标题不能为空', 'INVALID');
  if (!slug) throw new ApiError('链接标识不能为空', 'INVALID');
  if (!isValidSlug(slug)) {
    throw new ApiError('链接标识只能使用小写字母、数字和连字符', 'INVALID');
  }
  if (!date) throw new ApiError('日期不能为空', 'INVALID');
  if (!post.draft && !content) throw new ApiError('正文不能为空，或者先存成草稿', 'INVALID');
  if (all.some((item) => item.slug === slug && item.slug !== originalSlug)) {
    throw new ApiError('这个链接标识已经被占用了', 'INVALID');
  }

  return {
    ...post,
    slug,
    title,
    date,
    content,
    summary: post.summary.trim(),
    tags: post.tags.map((tag) => tag.trim()).filter(Boolean),
    // 阅读时长由正文推导，避免作者手填与内容不一致
    readingTime: estimateReadingTime(content),
  };
}

export const postsApi = {
  async list(params: PostQuery = {}): Promise<PostListResult> {
    const { tag, page = 1, pageSize = 6 } = params;
    return simulate(() =>
      cached(`posts:${tag ?? 'all'}:${page}:${pageSize}`, 60_000, () => {
        const filtered = tag
          ? publishedPosts().filter((post) => post.tags.includes(tag))
          : publishedPosts();
        const start = (page - 1) * pageSize;
        const items = filtered.slice(start, start + pageSize).map(toSummary);
        return {
          items,
          total: filtered.length,
          hasMore: start + items.length < filtered.length,
        };
      })
    );
  },

  async getBySlug(slug: string): Promise<Post> {
    return simulate(() => {
      const found = publishedPosts().find((post) => post.slug === slug);
      if (!found) throw new ApiError(`文章 ${slug} 不存在`, 'NOT_FOUND');
      return found;
    });
  },

  /** 上一篇为更新的一篇，下一篇为更早的一篇 */
  async getAdjacent(slug: string): Promise<{ prev?: PostSummary; next?: PostSummary }> {
    return simulate(() => {
      const list = publishedPosts();
      const index = list.findIndex((post) => post.slug === slug);
      if (index < 0) return {};
      return {
        prev: list[index - 1] ? toSummary(list[index - 1]!) : undefined,
        next: list[index + 1] ? toSummary(list[index + 1]!) : undefined,
      };
    });
  },

  /** 标签云：按文章数倒序 */
  async tags(): Promise<Array<{ tag: string; count: number }>> {
    return simulate(() => {
      const map = new Map<string, number>();
      for (const post of publishedPosts()) {
        for (const tag of post.tags) {
          map.set(tag, (map.get(tag) ?? 0) + 1);
        }
      }
      return [...map.entries()]
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);
    });
  },

  /* ---------- 后台接口：草稿也一并返回 ---------- */

  async adminList(): Promise<Post[]> {
    return simulate(() =>
      readPosts().sort((a, b) => b.date.localeCompare(a.date))
    );
  },

  async adminGet(slug: string): Promise<Post> {
    return simulate(() => {
      const found = readPosts().find((post) => post.slug === slug);
      if (!found) throw new ApiError(`文章 ${slug} 不存在`, 'NOT_FOUND');
      return found;
    });
  },

  async create(post: Post): Promise<Post> {
    return simulate(() => {
      const all = readPosts();
      const saved = validate(post, all);
      writePosts([...all, saved]);
      return saved;
    });
  },

  async update(originalSlug: string, post: Post): Promise<Post> {
    return simulate(() => {
      const all = readPosts();
      const index = all.findIndex((item) => item.slug === originalSlug);
      if (index < 0) throw new ApiError(`文章 ${originalSlug} 不存在`, 'NOT_FOUND');

      const saved = validate(post, all, originalSlug);
      all[index] = saved;
      writePosts(all);
      return saved;
    });
  },

  async remove(slug: string): Promise<void> {
    return simulate(() => {
      const all = readPosts();
      if (!all.some((item) => item.slug === slug)) {
        throw new ApiError(`文章 ${slug} 不存在`, 'NOT_FOUND');
      }
      writePosts(all.filter((item) => item.slug !== slug));
    });
  },
};
