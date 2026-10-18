import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/admin/PageHeader';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

/** 后台 404：保持在侧栏内，方便直接回到仪表盘 */
export default function AdminNotFound() {
  useDocumentMeta({ title: '页面不存在 · 奶龙后台' });

  return (
    <div>
      <PageHeader eyebrow="404" title="后台页面不存在" description="链接可能写错了，或者这个页面还没做。" />
      <EmptyState
        mood="sad"
        title="奶龙翻遍了后台也没找到"
        description="回仪表盘看看有哪些可以管理的内容。"
        action={<Button to="/admin">回到仪表盘</Button>}
      />
    </div>
  );
}
