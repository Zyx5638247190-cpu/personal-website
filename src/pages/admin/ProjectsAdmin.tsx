import { useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsApi } from '@/api/projects';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useToast } from '@/hooks/useToast';
import { PageHeader } from '@/components/admin/PageHeader';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { IconActionButton } from '@/components/admin/RowActions';
import { iconActionClass } from '@/components/admin/icon-action';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Tag } from '@/components/ui/Tag';
import { PencilIcon, PlusIcon, StarIcon, TrashIcon } from '@/components/icons';
import { PROJECT_STATUS_LABEL, PROJECT_STATUS_STYLE } from '@/lib/project-status';
import { errorMessage } from '@/lib/error';
import { cn } from '@/lib/cn';
import type { Project } from '@/types/models';

/** 项目管理列表：编辑跳独立页面，删除需二次确认 */
export default function AdminProjects() {
  const { data, loading, error, refetch } = useAsync(
    () => projectsApi.list({ status: 'all' }),
    []
  );
  const { toast } = useToast();

  const [deleting, setDeleting] = useState<Project | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  useDocumentMeta({ title: '项目管理 · 奶龙后台' });

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await projectsApi.remove(deleting.slug);
      toast('项目删掉了');
      setDeleting(null);
      refetch();
    } catch (reason) {
      toast(errorMessage(reason, '奶龙没删掉，再试一次？'), 'error');
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Projects"
        title="项目管理"
        description="项目会展示在首页与项目页，精选项目优先排序。"
        actions={
          <Button to="/admin/projects/new" size="sm">
            <PlusIcon />
            新建项目
          </Button>
        }
      />

      {error ? (
        <EmptyState
          mood="sad"
          title="项目列表没读出来"
          description="星星把卡片盖住了，再拨一次？"
          action={
            <Button size="sm" onClick={refetch}>
              重试
            </Button>
          }
        />
      ) : loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-[92px]" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <EmptyState
          mood="curious"
          title="还没有项目"
          description="把最近做的东西记下来吧。"
          action={
            <Button to="/admin/projects/new" size="sm">
              新建项目
            </Button>
          }
        />
      ) : (
        <ul className="overflow-hidden rounded-card border border-border bg-surface/60">
          {data.map((project) => (
            <li
              key={project.slug}
              className="flex flex-wrap items-start gap-3 border-b border-border p-4 last:border-b-0 sm:flex-nowrap sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-semibold text-text">{project.title}</h2>
                  {project.featured ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-primary-ink">
                      <StarIcon className="fill-primary-500/20" />
                      精选
                    </span>
                  ) : null}
                  {/* featured 已由星标表达，再渲染状态标签会出现两次「精选」 */}
                  {project.status === 'featured' ? null : (
                    <span
                      className={cn(
                        'rounded-full border px-2 py-0.5 text-[10px] leading-tight',
                        PROJECT_STATUS_STYLE[project.status]
                      )}
                    >
                      {PROJECT_STATUS_LABEL[project.status]}
                    </span>
                  )}
                </div>

                <p className="mt-1 line-clamp-1 text-xs text-text-muted">{project.summary}</p>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-text-dim">
                  <span>{project.date}</span>
                  <span aria-hidden="true">·</span>
                  <span className="break-all">{project.slug}</span>
                  {project.tags.slice(0, 4).map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Link
                  to={`/admin/projects/${project.slug}/edit`}
                  aria-label={`编辑项目 ${project.title}`}
                  title="编辑项目"
                  className={iconActionClass()}
                >
                  <PencilIcon />
                </Link>
                <IconActionButton
                  label={`删除项目 ${project.title}`}
                  tone="danger"
                  onClick={() => setDeleting(project)}
                >
                  <TrashIcon />
                </IconActionButton>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="删除这个项目？"
        description={
          deleting
            ? `删除「${deleting.title}」后，前台项目区会立即移除它。这个操作不能撤销。`
            : ''
        }
        loading={deleteBusy}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
