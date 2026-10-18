import { Link } from 'react-router-dom';
import { adminApi } from '@/api/admin';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Tag } from '@/components/ui/Tag';
import {
  ArrowRightIcon,
  FileTextIcon,
  FolderIcon,
  PencilIcon,
  PlusIcon,
  SparkleIcon,
  UserIcon,
} from '@/components/icons';
import { formatDate } from '@/lib/date';

/** 仪表盘：三块统计 + 最近文章 + 快捷入口 */
export default function AdminDashboard() {
  const { data, loading, error, refetch } = useAsync(() => adminApi.overview(), []);

  useDocumentMeta({ title: '仪表盘 · 奶龙后台' });

  const stats = data
    ? [
        {
          label: '项目',
          value: data.projects,
          unit: '个',
          hint: '已录入的项目',
          to: '/admin/projects',
          Icon: FolderIcon,
        },
        {
          label: '博客',
          value: data.posts,
          unit: '篇',
          hint: data.drafts > 0 ? `其中 ${data.drafts} 篇草稿` : '全部已发布',
          to: '/admin/posts',
          Icon: FileTextIcon,
        },
        {
          label: '技能',
          value: data.skills,
          unit: '项',
          hint: '分布在各个分类',
          to: '/admin/skills',
          Icon: SparkleIcon,
        },
      ]
    : [];

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="仪表盘"
        description="这里能看到站点内容的总览。改动保存后会立即同步到前台。"
        actions={
          <>
            <Button to="/admin/posts/new" size="sm">
              <PlusIcon />
              写新文章
            </Button>
            <Button to="/admin/projects/new" size="sm" variant="ghost">
              新建项目
            </Button>
          </>
        }
      />

      {error ? (
        <EmptyState
          mood="sad"
          title="统计数字躲起来了"
          description="再算一次试试？"
          action={
            <Button size="sm" onClick={refetch}>
              重试
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-[132px]" />
                ))
              : stats.map(({ label, value, unit, hint, to, Icon }) => (
                  <Link
                    key={label}
                    to={to}
                    className="group rounded-card border border-border bg-surface/60 p-5 transition-colors hover:border-border-strong hover:bg-surface"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-card border border-border bg-bg/40 text-primary-ink">
                        <Icon />
                      </span>
                      <ArrowRightIcon className="h-4 w-4 text-text-dim transition-transform group-hover:translate-x-1 group-hover:text-primary-ink" />
                    </div>
                    <p className="mt-4 text-3xl font-bold tracking-tight text-text">
                      {value}
                      <span className="ml-1 text-sm font-normal text-text-muted">{unit}</span>
                    </p>
                    <p className="mt-1 text-xs text-text-dim">
                      {label} · {hint}
                    </p>
                  </Link>
                ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <section className="rounded-card border border-border bg-surface/60">
              <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                <h2 className="text-sm font-semibold text-text">最近的博客</h2>
                <Link
                  to="/admin/posts"
                  className="inline-flex items-center gap-1 text-xs text-text-muted transition-colors hover:text-primary-ink"
                >
                  全部文章
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              </header>

              {loading ? (
                <div className="space-y-3 p-5">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-12" />
                  ))}
                </div>
              ) : data && data.recentPosts.length > 0 ? (
                <ul className="divide-y divide-border">
                  {data.recentPosts.map((post) => (
                    <li key={post.slug}>
                      <Link
                        to={`/admin/posts/${post.slug}/edit`}
                        className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-surface-hover/60"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-text">{post.title}</p>
                          <p className="mt-0.5 text-[11px] text-text-dim">
                            {formatDate(post.date)} · {post.readingTime} 分钟读完
                          </p>
                        </div>
                        {post.draft ? <Tag>草稿</Tag> : null}
                        <PencilIcon className="h-4 w-4 shrink-0 text-text-dim" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-5">
                  <EmptyState
                    mood="sleepy"
                    title="还没有文章"
                    description="第一篇文章总是最难开始的。"
                    action={
                      <Button to="/admin/posts/new" size="sm">
                        写一篇
                      </Button>
                    }
                  />
                </div>
              )}
            </section>

            <section className="rounded-card border border-border bg-surface/60 p-5">
              <h2 className="text-sm font-semibold text-text">快捷入口</h2>
              <div className="mt-4 space-y-2">
                <Link
                  to="/admin/profile"
                  className="flex min-h-11 items-center gap-3 rounded-card border border-border bg-bg/30 px-3 text-sm text-text-muted transition-colors hover:border-border-strong hover:text-text"
                >
                  <UserIcon />
                  编辑个人信息
                </Link>
                <Link
                  to="/admin/skills"
                  className="flex min-h-11 items-center gap-3 rounded-card border border-border bg-bg/30 px-3 text-sm text-text-muted transition-colors hover:border-border-strong hover:text-text"
                >
                  <SparkleIcon />
                  管理技能
                </Link>
                <Link
                  to="/admin/projects/new"
                  className="flex min-h-11 items-center gap-3 rounded-card border border-border bg-bg/30 px-3 text-sm text-text-muted transition-colors hover:border-border-strong hover:text-text"
                >
                  <FolderIcon />
                  新建项目
                </Link>
                <Link
                  to="/"
                  className="flex min-h-11 items-center gap-3 rounded-card border border-primary-500/30 bg-primary-500/10 px-3 text-sm text-primary-ink transition-colors hover:bg-primary-500/15"
                >
                  <ArrowRightIcon className="h-4 w-4" />
                  去前台看看
                </Link>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
