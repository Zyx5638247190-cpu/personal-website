import { useState } from 'react';
import { Link } from 'react-router-dom';
import { postsApi } from '@/api/posts';
import { useAsync } from '@/hooks/useAsync';
import { useToast } from '@/hooks/useToast';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Reveal } from '@/components/ui/Reveal';
import { ArrowRightIcon } from '@/components/icons';
import { formatDate } from '@/lib/date';
import type { PostSummary } from '@/types/models';

interface BlogListProps {
  tag?: string;
  pageSize: number;
  /** 是否允许「加载更多」；首页只展示最近几篇时关闭 */
  allowLoadMore: boolean;
  onClearTag?: () => void;
}

/**
 * 博客列表主体：首屏用 useAsync 取第一页，「加载更多」在点击时追加。
 * 外层用 key={tag} 强制重建，切换标签时无需 effect 重置分页状态。
 */
export function BlogList({ tag, pageSize, allowLoadMore, onClearTag }: BlogListProps) {
  const { data, loading, error, refetch } = useAsync(
    () => postsApi.list({ tag, page: 1, pageSize }),
    [tag, pageSize]
  );
  const { toast } = useToast();

  const [extra, setExtra] = useState<{
    items: PostSummary[];
    page: number;
    hasMore: boolean;
  }>({ items: [], page: 1, hasMore: false });
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const items = [...(data?.items ?? []), ...extra.items];
  // 追加过一页后以追加结果为准，否则用首屏响应的 hasMore
  const hasMore = extra.items.length > 0 ? extra.hasMore : (data?.hasMore ?? false);
  const nextPage = extra.items.length > 0 ? extra.page + 1 : 2;

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const result = await postsApi.list({ tag, page: nextPage, pageSize });
      setExtra((prev) => ({
        items: [...prev.items, ...result.items],
        page: nextPage,
        hasMore: result.hasMore,
      }));
    } catch {
      toast('奶龙没加载出来，再试一次？', 'error');
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (error) {
    return (
      <EmptyState
        mood="sleepy"
        title="文章还在奶龙脑子里"
        description="稍后再来看看？"
        action={<Button size="sm" onClick={refetch}>重试</Button>}
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: Math.min(pageSize, 3) }).map((_, index) => (
          <div key={index} className="rounded-card border border-border bg-surface/50 p-5">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="mt-3 h-6 w-2/3" />
            <Skeleton className="mt-2 h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return tag ? (
      <EmptyState
        mood="curious"
        title="这个标签下还没有文章"
        description="奶龙帮你找找别的？"
        action={
          <Button size="sm" variant="ghost" onClick={onClearTag}>
            看全部文章
          </Button>
        }
      />
    ) : (
      <EmptyState
        mood="sleepy"
        title="还没写，但奶龙已经在思考了…"
        description="等它想明白，第一篇就出现在这里。"
      />
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-card border border-border bg-surface/40">
        {items.map((post, index) => (
          <Reveal
            key={post.slug}
            delay={Math.min(index, 4) * 60}
            className="border-b border-border last:border-b-0"
          >
            <Link
              to={`/blog/${post.slug}`}
              className="group flex flex-col gap-2 p-5 transition-colors hover:bg-surface-hover/60 sm:p-6"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-text-dim">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readingTime} 分钟读完</span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <h3 className="text-base font-semibold text-text transition-colors group-hover:text-primary-ink sm:text-lg">
                  {post.title}
                </h3>
                <ArrowRightIcon className="mt-1 h-4 w-4 shrink-0 text-text-dim transition-transform group-hover:translate-x-1 group-hover:text-primary-ink" />
              </div>

              <p className="line-clamp-2 max-w-3xl text-sm leading-relaxed text-text-muted">
                {post.summary}
              </p>

              <div className="mt-1 flex flex-wrap gap-2">
                {post.tags.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      {allowLoadMore && hasMore ? (
        <div className="mt-6 flex justify-center">
          <Button variant="ghost" size="sm" onClick={handleLoadMore} disabled={isLoadingMore}>
            {isLoadingMore ? '奶龙正在搬砖…' : '加载更多'}
          </Button>
        </div>
      ) : null}
    </>
  );
}
