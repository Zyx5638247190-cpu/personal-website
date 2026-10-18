import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { errorMessage } from '@/lib/error';
import { isValidSlug, toSlug } from '@/lib/slug';
import { PROJECT_STATUS_LABEL } from '@/lib/project-status';
import { FormSection } from './FormSection';
import { SelectField, SwitchField, TextAreaField, TextField } from './FormControls';
import { TagsField } from './TagsField';
import type { Project, ProjectStatus } from '@/types/models';

interface ProjectFormProps {
  initial: Project;
  /** 新建与编辑共用同一张表单，仅按钮文案不同 */
  submitLabel: string;
  onSubmit: (next: Project) => Promise<void>;
  onCancel: () => void;
}

export function ProjectForm({ initial, submitLabel, onSubmit, onCancel }: ProjectFormProps) {
  const [draft, setDraft] = useState<Project>(initial);
  const [errors, setErrors] = useState<{ title?: string; slug?: string; date?: string }>({});
  const [saving, setSaving] = useState(false);
  // 编辑已有项目时不自动改 slug；新建时随标题生成，用户手改后锁定
  const [slugLocked, setSlugLocked] = useState(Boolean(initial.slug));
  const { toast } = useToast();

  const update = <K extends keyof Project>(key: K, value: Project[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const title = draft.title.trim();
    const slug = draft.slug.trim();
    const date = draft.date.trim();
    const nextErrors: typeof errors = {};
    if (!title) nextErrors.title = '标题不能为空';
    if (!slug) nextErrors.slug = '链接标识不能为空';
    else if (!isValidSlug(slug)) nextErrors.slug = '只能使用小写字母、数字和连字符';
    if (!date) nextErrors.date = '请选择日期';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const order = Number(draft.order);
    const next: Project = {
      ...draft,
      title,
      slug,
      date,
      summary: draft.summary.trim(),
      tags: draft.tags.map((tag) => tag.trim()).filter(Boolean),
      content: draft.content?.trim() ?? '',
      order: draft.order === undefined || Number.isNaN(order) ? undefined : order,
      links: {
        ...(draft.links.live?.trim() ? { live: draft.links.live.trim() } : {}),
        ...(draft.links.repo?.trim() ? { repo: draft.links.repo.trim() } : {}),
      },
    };

    setSaving(true);
    try {
      await onSubmit(next);
      toast('嗷！项目保存好了');
    } catch (error) {
      toast(errorMessage(error), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <FormSection title="项目信息" description="摘要会显示在项目卡片上，保持在两行以内最好看。">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="标题"
            required
            value={draft.title}
            error={errors.title}
            onChange={(event) => {
              const title = event.target.value;
              setDraft((current) => ({
                ...current,
                title,
                slug: slugLocked ? current.slug : toSlug(title),
              }));
            }}
            placeholder="奶龙小站"
          />
          <TextField
            label="链接标识（slug）"
            required
            value={draft.slug}
            error={errors.slug}
            onChange={(event) => {
              setSlugLocked(true);
              update('slug', event.target.value);
            }}
            placeholder="naidragon-site"
            hint="会出现在前台 URL 中，只能用小写字母、数字和连字符"
          />
        </div>

        <TextAreaField
          label="摘要"
          value={draft.summary}
          onChange={(event) => update('summary', event.target.value)}
          placeholder="一句话说清这个项目解决了什么问题。"
          rows={3}
        />

        <TextAreaField
          label="项目详情"
          value={draft.content ?? ''}
          onChange={(event) => update('content', event.target.value)}
          placeholder="展开讲讲背景、方案与结果，空行分段。"
          hint="前台卡片只展示摘要；详情内容保存在数据层，供项目详情页使用。"
          rows={6}
        />

        <TagsField
          label="技术标签"
          value={draft.tags}
          onChange={(tags) => update('tags', tags)}
          hint="回车或逗号确认，卡片最多展示 4 个"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="日期"
            type="month"
            required
            value={draft.date}
            error={errors.date}
            onChange={(event) => update('date', event.target.value)}
          />
          <SelectField
            label="状态"
            value={draft.status}
            onChange={(event) => update('status', event.target.value as ProjectStatus)}
          >
            {(Object.keys(PROJECT_STATUS_LABEL) as ProjectStatus[]).map((status) => (
              <option key={status} value={status}>
                {PROJECT_STATUS_LABEL[status]}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SwitchField
            label="设为精选"
            description="精选项目会优先出现在前台列表"
            checked={draft.featured}
            onChange={(featured) => update('featured', featured)}
          />
          <TextField
            label="排序权重"
            type="number"
            min={1}
            value={draft.order ?? ''}
            onChange={(event) =>
              update('order', event.target.value === '' ? undefined : Number(event.target.value))
            }
            hint="数字越小越靠前，留空按日期排序"
          />
        </div>
      </FormSection>

      <FormSection title="项目链接" description="留空的链接不会在前台显示。">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="在线预览"
            type="url"
            value={draft.links.live ?? ''}
            onChange={(event) =>
              update('links', { ...draft.links, live: event.target.value })
            }
            placeholder="https://example.com"
          />
          <TextField
            label="源码地址"
            type="url"
            value={draft.links.repo ?? ''}
            onChange={(event) =>
              update('links', { ...draft.links, repo: event.target.value })
            }
            placeholder="https://github.com/..."
          />
        </div>
      </FormSection>

      <div className="flex flex-wrap items-center justify-end gap-3 rounded-card border border-border bg-surface/60 p-4">
        <Button variant="ghost" onClick={onCancel} disabled={saving}>
          取消
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? '保存中…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
