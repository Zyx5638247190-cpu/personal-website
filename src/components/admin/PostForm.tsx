import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { errorMessage } from '@/lib/error';
import { estimateReadingTime } from '@/lib/date';
import { isValidSlug, toSlug } from '@/lib/slug';
import { FormSection } from './FormSection';
import { SwitchField, TextAreaField, TextField } from './FormControls';
import { TagsField } from './TagsField';
import type { Post } from '@/types/models';

interface PostFormProps {
  initial: Post;
  submitLabel: string;
  onSubmit: (next: Post) => Promise<void>;
  onCancel: () => void;
}

export function PostForm({ initial, submitLabel, onSubmit, onCancel }: PostFormProps) {
  const [draft, setDraft] = useState<Post>(initial);
  const [errors, setErrors] = useState<{ title?: string; slug?: string; date?: string }>({});
  const [saving, setSaving] = useState(false);
  const [slugLocked, setSlugLocked] = useState(Boolean(initial.slug));
  const { toast } = useToast();
  const readingTime = estimateReadingTime(draft.content);

  const update = <K extends keyof Post>(key: K, value: Post[K]) => {
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

    const next: Post = {
      ...draft,
      title,
      slug,
      date,
      content: draft.content.trim(),
      summary: draft.summary.trim(),
      tags: draft.tags.map((tag) => tag.trim()).filter(Boolean),
      // 接口层会再算一次，这里提前算好让表单上的预估一致
      readingTime: estimateReadingTime(draft.content.trim()),
    };

    setSaving(true);
    try {
      await onSubmit(next);
      toast('嗷！博客保存好了');
    } catch (error) {
      toast(errorMessage(error), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <FormSection title="文章信息" description="草稿不会出现在前台，取消勾选后立即发布。">
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
            placeholder="为什么我给自己的网站画了一只奶龙"
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
            placeholder="why-i-draw-a-dragon"
            hint="会出现在 /blog/ 后面，只能用小写字母、数字和连字符"
          />
        </div>

        <TextAreaField
          label="摘要"
          value={draft.summary}
          onChange={(event) => update('summary', event.target.value)}
          placeholder="一两句话说明这篇文章讲什么。"
          rows={3}
        />

        <TagsField
          label="标签"
          value={draft.tags}
          onChange={(tags) => update('tags', tags)}
          hint="回车或逗号确认，前台按标签筛选"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="发布日期"
            type="date"
            required
            value={draft.date}
            error={errors.date}
            onChange={(event) => update('date', event.target.value)}
          />
          <div className="flex flex-col justify-end">
            <SwitchField
              label="保存为草稿"
              description="草稿只在后台可见"
              checked={Boolean(draft.draft)}
              onChange={(isDraft) => update('draft', isDraft)}
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="正文"
        description={`用空行分段，当前约 ${readingTime} 分钟读完（保存时会自动更新）。`}
      >
        <TextAreaField
          label="内容"
          value={draft.content}
          onChange={(event) => update('content', event.target.value)}
          placeholder="在这里写正文，空行分段…"
          hint="草稿可以为空；正式发布的文章必须有正文。"
          rows={18}
          className="font-[inherit] leading-[1.9]"
        />
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
