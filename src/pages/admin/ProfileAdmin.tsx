import { profileApi } from '@/api/profile';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { PageHeader } from '@/components/admin/PageHeader';
import { ProfileForm } from '@/components/admin/ProfileForm';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import type { Profile } from '@/types/models';

/** 个人信息管理：取数后交给表单，保存逻辑收在 API 层 */
export default function AdminProfile() {
  const { data, loading, error, refetch } = useAsync(() => profileApi.get(), []);

  useDocumentMeta({ title: '个人信息 · 奶龙后台' });

  const handleSubmit = async (next: Profile) => {
    await profileApi.update(next);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Profile"
        title="个人信息"
        description="修改后会同步到首页 Hero 与关于区。空行分段、条目顺序都会按这里的填写展示。"
      />

      {error ? (
        <EmptyState
          mood="sad"
          title="资料没有读出来"
          description="奶龙再翻一次抽屉。"
          action={
            <Button size="sm" onClick={refetch}>
              重试
            </Button>
          }
        />
      ) : loading || !data ? (
        <div className="space-y-5">
          <Skeleton className="h-[260px]" />
          <Skeleton className="h-[180px]" />
          <Skeleton className="h-[200px]" />
        </div>
      ) : (
        <ProfileForm initial={data} onSubmit={handleSubmit} />
      )}
    </div>
  );
}
