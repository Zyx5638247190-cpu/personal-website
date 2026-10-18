import { useState } from 'react';
import { Link } from 'react-router-dom';
import { postsApi } from '@/api/posts';
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
import { EyeIcon, PencilIcon, PlusIcon, TrashIcon } from '@/components/icons';
import { formatDate } from '@/lib/date';
import { errorMessage } from '@/lib/error';
import type { Post } from '@/types/models';

/** 博客管理：草稿与已发布混排，用标签区分；编辑跳独立页面 */
export default function AdminPosts() {
  const { data, loading, error, refetch } = useAsync(() => postsApi.adminList(), []);
  const { toast } = useToast();

  const [deleting, setDeleting] = useState<Post | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  useDocumentMeta({ title: '博客管理 · 奶龙后台' });

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await postsApi.remove(deleting.slug);
      toast('文章删掉了');
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
        eyebrow="Posts"
        title="博客管理"
        description="草稿不会出现在前台。正文用空行分段，阅读时长按内容自动计算。"
        actions={
          <Button to="/admin/posts/new" size="sm">
            <PlusIcon />
            写新文章
          </Button>
        }
      />

      {error ? (
        <EmptyState
          mood="sad"
          title="文章列表没读出来"
          description="奶龙再翻一次草稿箱。"
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
          mood="sleepy"
          title="还没有文章"
          description="先写一篇，草稿也可以。"
          action={
            <Button to="/admin/posts/new" size="sm">
              写一篇
            </Button>
          }
        />
      ) : (
        <ul className="overflow-hidden rounded-card border border-border bg-surface/60">
          {data.map((post) => (
            <li
              key={post.slug}
              className="flex flex-wrap items-start gap-3 border-b border-border p-4 last:border-b-0 sm:flex-nowrap sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-semibold text-text">{post.title}</h2>
                  {post.draft ? <Tag active>草稿</Tag> : null}
                </div>

                <p className="mt-1 line-clamp-1 text-xs text-text-muted">{post.summary}</p>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-text-dim">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span aria-hidden="true">·</span>
                  <span>{post.readingTime} 分钟读完</span>
                  <span aria-hidden="true">·</span>
                  <span className="break-all">{post.slug}</span>
                  {post.tags.slice(0, 3).map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {post.draft ? null : (
                  <Link
                    to={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`预览文章 ${post.title}`}
                    title="在新窗口预览"
                    className={iconActionClass()}
                  >
                    <EyeIcon />
                  </Link>
                )}
                <Link
                  to={`/admin/posts/${post.slug}/edit`}
                  aria-label={`编辑文章 ${post.title}`}
                  title="编辑文章"
                  className={iconActionClass()}
                >
                  <PencilIcon />
                </Link>
                <IconActionButton
                  label={`删除文章 ${post.title}`}
                  tone="danger"
                  onClick={() => setDeleting(post)}
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
        title="删除这篇文章？"
        description={
          deleting
            ? `删除「${deleting.title}」后无法恢复，前台也不会再看到它。`
            : ''
        }
        loading={deleteBusy}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
