import { Link, useNavigate, useParams } from 'react-router-dom';
import { postsApi } from '@/api/posts';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { PageHeader } from '@/components/admin/PageHeader';
import { PostForm } from '@/components/admin/PostForm';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArrowLeftIcon } from '@/components/icons';
import type { Post } from '@/types/models';

/** 新建草稿默认值：日期取本地日期，默认存草稿，避免空文章误发布 */
function createEmptyPost(): Post {
  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`;
  return {
    slug: '',
    title: '',
    summary: '',
    content: '',
    date,
    tags: [],
    readingTime: 1,
    draft: true,
  };
}

export default function AdminPostEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isNew = !slug;

  const { data, loading, error, refetch } = useAsync<Post | null>(
    () => (slug ? postsApi.adminGet(slug) : Promise.resolve(null)),
    [slug]
  );

  useDocumentMeta({ title: isNew ? '新建博客 · 奶龙后台' : '编辑博客 · 奶龙后台' });

  const handleSubmit = async (next: Post) => {
    if (isNew) await postsApi.create(next);
    else await postsApi.update(slug!, next);
    navigate('/admin/posts');
  };

  return (
    <div>
      <Link
        to="/admin/posts"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-primary-ink"
      >
        <ArrowLeftIcon />
        返回博客列表
      </Link>

      <PageHeader
        eyebrow="Post editor"
        title={isNew ? '新建博客' : '编辑博客'}
        description={
          isNew
            ? '默认存为草稿，写完后取消勾选「保存为草稿」即可发布。'
            : '修改后会立即同步到前台博客区与详情页。'
        }
      />

      {error ? (
        <EmptyState
          mood="sad"
          title="这篇文章找不到了"
          description="可能已经被删除，或者链接标识改过。"
          action={<Button to="/admin/posts">回博客列表</Button>}
        />
      ) : loading ? (
        <div className="space-y-4">
          <Skeleton className="h-[220px]" />
          <Skeleton className="h-[420px]" />
        </div>
      ) : (
        <PostForm
          key={slug ?? 'new'}
          initial={data ?? createEmptyPost()}
          submitLabel={isNew ? '保存文章' : '保存修改'}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/posts')}
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
