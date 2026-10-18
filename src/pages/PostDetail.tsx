import { Link, useParams } from 'react-router-dom';
import { postsApi } from '@/api/posts';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { DragonMascot } from '@/components/mascot/DragonMascot';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArrowRightIcon } from '@/components/icons';
import { formatDate } from '@/lib/date';

/** 博客详情：当前用段落渲染正文，Markdown 渲染器在后续迭代接入 */
export default function PostDetail() {
  const { slug = '' } = useParams();
  const { data: post, loading, error } = useAsync(() => postsApi.getBySlug(slug), [slug]);

  useDocumentMeta({
    title: post ? `${post.title} · 奶龙小站` : '文章 · 奶龙小站',
    description: post?.summary,
  });

  return (
    <div className="pt-28 pb-20">
      <div className="container-page max-w-3xl">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-primary-ink"
        >
          <ArrowRightIcon className="h-4 w-4 rotate-180" />
          回到博客列表
        </Link>

        {loading ? (
          <div className="mt-8 space-y-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : error || !post ? (
          <div className="mt-10">
            <EmptyState
              mood="sad"
              title="这篇文章走丢了"
              description="奶龙翻遍了星星，也没找到它。"
              action={<Button to="/blog">回博客列表</Button>}
            />
          </div>
        ) : (
          <article className="mt-8">
            <header className="border-b border-border pb-8">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-dim">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readingTime} 分钟读完</span>
              </div>
              <h1 className="mt-3 text-3xl font-bold text-text sm:text-4xl">{post.title}</h1>
              <p className="mt-3 text-sm leading-relaxed text-text-muted sm:text-base">
                {post.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </header>

            <div className="mt-8 space-y-5">
              {post.content.split(/\n{2,}/).map((paragraph) => (
                <p key={paragraph.slice(0, 16)} className="text-[15px] leading-[1.9] text-text-muted sm:text-base">
                  {paragraph}
                </p>
              ))}
            </div>

            <footer className="mt-12 flex items-center gap-4 rounded-card border border-border bg-surface/50 p-5">
              <DragonMascot size="sm" mood="happy" />
              <p className="text-sm text-text-muted">
                读完了，嗷！如果这篇对你有用，欢迎来{' '}
                <Link to="/#contact" className="text-primary-ink underline underline-offset-4">
                  和我聊聊
                </Link>
                。
              </p>
            </footer>
          </article>
        )}
      </div>
    </div>
  );
}
