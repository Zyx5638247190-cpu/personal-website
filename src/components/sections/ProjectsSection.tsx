import { Link, useSearchParams } from 'react-router-dom';
import { projectsApi } from '@/api/projects';
import { useAsync } from '@/hooks/useAsync';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Reveal } from '@/components/ui/Reveal';
import { DragonMascot } from '@/components/mascot/DragonMascot';
import { ArrowRightIcon, ExternalLinkIcon, GithubIcon } from '@/components/icons';
import { cn } from '@/lib/cn';
import {
  PROJECT_STATUS_FILTERS,
  PROJECT_STATUS_LABEL,
  PROJECT_STATUS_STYLE,
} from '@/lib/project-status';
import type { ProjectStatus } from '@/types/models';

/** 只接受三个合法状态，避免 URL 里塞进无意义的值导致空列表 */
function isProjectStatus(value: string | null): value is ProjectStatus {
  return value === 'featured' || value === 'wip' || value === 'archived';
}

interface ProjectsSectionProps {
  /** 首页只展示前几项，并把「全部项目」链接放到标题右侧 */
  limit?: number;
  /** 独立项目页显示筛选 chips；首页不显示 */
  showFilters?: boolean;
  headingLevel?: 1 | 2;
}

/** 项目区：筛选 + 封面占位（渐变 + 奶龙）+ 技术标签 + 外链 */
export function ProjectsSection({
  limit,
  showFilters = false,
  headingLevel = 2,
}: ProjectsSectionProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawStatus = searchParams.get('status');
  // 只有独立项目页才读取筛选参数，避免首页被 ?status= 意外过滤
  const status: ProjectStatus | 'all' = showFilters && isProjectStatus(rawStatus) ? rawStatus : 'all';

  const { data, loading, error, refetch } = useAsync(
    () => projectsApi.list({ status }),
    [status]
  );

  const projects = limit ? data?.slice(0, limit) : data;

  const handleFilter = (next: ProjectStatus | 'all') => {
    const params = new URLSearchParams(searchParams);
    if (next === 'all') params.delete('status');
    else params.set('status', next);
    // replace 避免筛选历史堆满浏览器返回栈
    setSearchParams(params, { replace: true });
  };

  return (
    <section id="projects" className="relative py-20 lg:py-28">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              level={headingLevel}
              eyebrow="项目"
              title="奶龙做过的东西"
              description="从站点本身到组件库，每一个都尽量把复杂问题收进一个简单入口。"
              className="!mb-0"
            />
            {limit ? (
              <Link
                to="/projects"
                className="mb-1 inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-primary-ink"
              >
                全部项目
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </Reveal>

        {showFilters ? (
          <div
            className="mt-8 flex flex-wrap gap-2"
            role="group"
            aria-label="按项目状态筛选"
          >
            {PROJECT_STATUS_FILTERS.map((filter) => {
              const isActive = status === filter.value;
              return (
                <button
                  key={filter.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => handleFilter(filter.value)}
                  className={cn(
                    'inline-flex h-11 items-center rounded-button border px-4 text-sm transition-colors',
                    isActive
                      ? 'border-primary-500/50 bg-primary-500/15 text-primary-ink'
                      : 'border-border bg-surface/50 text-text-muted hover:border-border-strong hover:text-text'
                  )}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="mt-8">
          {error ? (
            <EmptyState
              mood="sad"
              title="项目卡片被星星盖住了"
              description="再拨开一次看看？"
              action={<Button size="sm" onClick={refetch}>重试</Button>}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {loading
                ? Array.from({ length: limit ?? 3 }).map((_, index) => (
                    <div key={index} className="overflow-hidden rounded-card border border-border">
                      <Skeleton className="aspect-[16/10] rounded-none" />
                      <div className="space-y-3 p-5">
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                      </div>
                    </div>
                  ))
                : projects?.map((project, index) => (
                    <Reveal key={project.slug} delay={index * 80}>
                      <article className="group flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface/50 transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:bg-surface">
                        <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden border-b border-border bg-bg-soft">
                          {/* 占位封面：暖黄光斑 + 奶龙，不依赖任何图片资源 */}
                          <div className="cover-glow absolute inset-0 opacity-80" aria-hidden="true" />
                          <div className="cover-grid absolute inset-0" aria-hidden="true" />
                          <DragonMascot
                            size={120}
                            mood={project.status === 'wip' ? 'curious' : 'happy'}
                            className="relative h-[110px] w-[110px] transition-transform duration-500 group-hover:scale-110"
                          />
                          <span
                            className={[
                              'absolute top-3 right-3 rounded-full border px-2.5 py-1 text-[11px] leading-none',
                              PROJECT_STATUS_STYLE[project.status],
                            ].join(' ')}
                          >
                            {PROJECT_STATUS_LABEL[project.status]}
                          </span>
                        </div>

                        <div className="flex flex-1 flex-col p-5">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-base font-semibold text-text">{project.title}</h3>
                            <span className="shrink-0 text-[11px] text-text-dim">{project.date}</span>
                          </div>
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-muted">
                            {project.summary}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {project.tags.slice(0, 4).map((tag) => (
                              <Tag key={tag}>{tag}</Tag>
                            ))}
                          </div>

                          <div className="mt-auto flex items-center gap-4 pt-5 text-sm">
                            {project.links.live ? (
                              <a
                                href={project.links.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-primary-ink transition-opacity hover:opacity-80"
                              >
                                在线预览
                                <ExternalLinkIcon aria-label="在新窗口打开" />
                              </a>
                            ) : null}
                            {project.links.repo ? (
                              <a
                                href={project.links.repo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-text-muted transition-colors hover:text-primary-ink"
                              >
                                <GithubIcon className="h-4 w-4" />
                                源码
                                <ExternalLinkIcon aria-label="在新窗口打开" />
                              </a>
                            ) : null}
                            {!project.links.live && !project.links.repo ? (
                              <span className="text-xs text-text-dim">还在奶龙肚子里，稍后见</span>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    </Reveal>
                  ))}
            </div>
          )}

          {!error && !loading && projects?.length === 0 ? (
            <EmptyState
              mood="curious"
              title="这个筛选下什么都没有"
              description="奶龙也找不到…换个条件试试？"
              action={
                <Button size="sm" variant="ghost" onClick={() => handleFilter('all')}>
                  清除筛选
                </Button>
              }
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
