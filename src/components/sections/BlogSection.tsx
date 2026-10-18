import { Link, useSearchParams } from 'react-router-dom';
import { postsApi } from '@/api/posts';
import { useAsync } from '@/hooks/useAsync';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { ArrowRightIcon } from '@/components/icons';
import { cn } from '@/lib/cn';
import { BlogList } from './BlogList';

interface BlogSectionProps {
  /** 首页只展示最近几篇；不传时按 6 篇一页并允许加载更多 */
  limit?: number;
  showAllLink?: boolean;
  /** 独立博客页显示标签筛选，标签写进 ?tag= 便于刷新还原 */
  showFilters?: boolean;
  headingLevel?: 1 | 2;
}

/** 博客区：标题、摘要、日期、标签与阅读时长；筛选与分页交给 BlogList */
export function BlogSection({
  limit,
  showAllLink = true,
  showFilters = false,
  headingLevel = 2,
}: BlogSectionProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTag = searchParams.get('tag');
  const tag = showFilters && rawTag ? rawTag : undefined;
  const tags = useAsync(() => postsApi.tags(), []);
  const pageSize = limit ?? 6;

  const handleTag = (next?: string) => {
    const params = new URLSearchParams(searchParams);
    if (next) params.set('tag', next);
    else params.delete('tag');
    setSearchParams(params, { replace: true });
  };

  return (
    <section id="blog" className="relative py-20 lg:py-28">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              level={headingLevel}
              eyebrow="博客"
              title="奶龙也在努力写字"
              description="关于前端、设计与那些做东西时想明白的小事。"
              className="!mb-0"
            />
            {showAllLink ? (
              <Link
                to="/blog"
                className="mb-1 inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-primary-ink"
              >
                全部文章
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </Reveal>

        {showFilters ? (
          <div
            className="mt-8 flex flex-wrap gap-2"
            role="group"
            aria-label="按标签筛选文章"
          >
            <button
              type="button"
              aria-pressed={tag === undefined}
              onClick={() => handleTag()}
              className={cn(
                'inline-flex h-11 items-center rounded-button border px-4 text-sm transition-colors',
                tag === undefined
                  ? 'border-primary-500/50 bg-primary-500/15 text-primary-ink'
                  : 'border-border bg-surface/50 text-text-muted hover:border-border-strong hover:text-text'
              )}
            >
              全部
            </button>
            {tags.data?.map((item) => (
              <button
                key={item.tag}
                type="button"
                aria-pressed={tag === item.tag}
                onClick={() => handleTag(item.tag)}
                className={cn(
                  'inline-flex h-11 items-center gap-1.5 rounded-button border px-4 text-sm transition-colors',
                  tag === item.tag
                    ? 'border-primary-500/50 bg-primary-500/15 text-primary-ink'
                    : 'border-border bg-surface/50 text-text-muted hover:border-border-strong hover:text-text'
                )}
              >
                {item.tag}
                <span className="text-[11px] text-text-dim">{item.count}</span>
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-8">
          <BlogList
            key={tag ?? 'all'}
            tag={tag}
            pageSize={pageSize}
            allowLoadMore={showFilters && limit === undefined}
            onClearTag={() => handleTag()}
          />
        </div>
      </div>
    </section>
  );
}
