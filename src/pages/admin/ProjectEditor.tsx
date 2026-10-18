import { Link, useNavigate, useParams } from 'react-router-dom';
import { projectsApi } from '@/api/projects';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { PageHeader } from '@/components/admin/PageHeader';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArrowLeftIcon } from '@/components/icons';
import type { Project } from '@/types/models';

/** 新建时默认值：日期取本地月份，避免 UTC 时区在月初偏到上个月 */
function createEmptyProject(): Project {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return {
    slug: '',
    title: '',
    summary: '',
    content: '',
    tags: [],
    links: {},
    date: month,
    status: 'wip',
    featured: false,
  };
}

export default function AdminProjectEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isNew = !slug;

  const { data, loading, error, refetch } = useAsync<Project | null>(
    () => (slug ? projectsApi.getBySlug(slug) : Promise.resolve(null)),
    [slug]
  );

  useDocumentMeta({ title: isNew ? '新建项目 · 奶龙后台' : '编辑项目 · 奶龙后台' });

  const handleSubmit = async (next: Project) => {
    // 先写完再跳转，保存失败时停留在表单上并保留输入
    if (isNew) await projectsApi.create(next);
    else await projectsApi.update(slug!, next);
    navigate('/admin/projects');
  };

  return (
    <div>
      <Link
        to="/admin/projects"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-primary-ink"
      >
        <ArrowLeftIcon />
        返回项目列表
      </Link>

      <PageHeader
        eyebrow="Project editor"
        title={isNew ? '新建项目' : '编辑项目'}
        description={
          isNew
            ? '填好标题和链接标识就能保存，其余内容可以之后再补。'
            : '修改后会立即同步到前台项目区。'
        }
      />

      {error ? (
        <EmptyState
          mood="sad"
          title="这个项目找不到了"
          description="可能已经被删除，或者链接标识改过。"
          action={<Button to="/admin/projects">回项目列表</Button>}
        />
      ) : loading ? (
        <div className="space-y-4">
          <Skeleton className="h-[220px]" />
          <Skeleton className="h-[180px]" />
        </div>
      ) : (
        <ProjectForm
          key={slug ?? 'new'}
          initial={data ?? createEmptyProject()}
          submitLabel={isNew ? '创建项目' : '保存修改'}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/projects')}
        />
      )}

      {error ? (
        <button
          type="button"
          onClick={refetch}
          className="mt-4 text-xs text-text-dim underline underline-offset-4 hover:text-text"
        >
          再试一次
        </button>
      ) : null}
    </div>
  );
}
