import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { errorMessage } from '@/lib/error';
import { FormSection } from './FormSection';
import { SwitchField, TextAreaField, TextField } from './FormControls';
import { EducationEditor, QuickFactsEditor, SocialsEditor } from './ProfileLists';
import type { Profile } from '@/types/models';

interface ProfileFormProps {
  initial: Profile;
  /** 保存动作由页面注入，表单本身不直接碰 API */
  onSubmit: (next: Profile) => Promise<void>;
}

/** 个人信息表单：基本信息 + 分段简介 + 三组可增删条目 */
export function ProfileForm({ initial, onSubmit }: ProfileFormProps) {
  const [baseline, setBaseline] = useState<Profile>(initial);
  const [draft, setDraft] = useState<Profile>(initial);
  const [bioText, setBioText] = useState(() => initial.bio.join('\n\n'));
  const [errors, setErrors] = useState<{ name?: string; role?: string; email?: string }>({});
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const update = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  // 用序列化结果判断是否有改动，数据量很小，比逐字段比较更好维护
  const isDirty =
    JSON.stringify(draft) !== JSON.stringify(baseline) ||
    bioText !== baseline.bio.join('\n\n');

  const handleReset = () => {
    setDraft(baseline);
    setBioText(baseline.bio.join('\n\n'));
    setErrors({});
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const name = draft.name.trim();
    const role = draft.role.trim();
    const email = draft.email.trim();
    const nextErrors: typeof errors = {};
    if (!name) nextErrors.name = '名字不能为空';
    if (!role) nextErrors.role = '职位不能为空';
    if (email && !email.includes('@')) nextErrors.email = '邮箱格式看起来不对';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const next: Profile = {
      ...draft,
      name,
      role,
      email,
      handle: draft.handle.trim(),
      tagline: draft.tagline.trim(),
      location: draft.location.trim(),
      avatar: draft.avatar.trim() || '/avatar.svg',
      bio: bioText
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),
      availability: {
        open: draft.availability.open,
        label: draft.availability.label.trim() || '正在寻找新机会',
      },
      // 空行直接丢弃，避免前台渲染出空白条目
      quickFacts: draft.quickFacts
        .map((item) => ({ label: item.label.trim(), value: item.value.trim() }))
        .filter((item) => item.label && item.value),
      education: draft.education
        .map((item) => ({
          school: item.school.trim(),
          major: item.major.trim(),
          degree: item.degree.trim(),
          period: item.period.trim(),
        }))
        .filter((item) => item.school || item.major || item.degree || item.period),
      socials: draft.socials
        .map((item, index) => ({
          ...item,
          label: item.label.trim(),
          href: item.href.trim(),
          id: item.id || `social-${index + 1}`,
        }))
        .filter((item) => item.label && item.href),
    };

    setSaving(true);
    try {
      await onSubmit(next);
      setBaseline(next);
      setDraft(next);
      setBioText(next.bio.join('\n\n'));
      toast('嗷！资料保存好了');
    } catch (error) {
      toast(errorMessage(error), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <FormSection title="基本信息" description="名字、职位与头像会出现在首页 Hero 区域。">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="名字"
            required
            value={draft.name}
            error={errors.name}
            onChange={(event) => update('name', event.target.value)}
            placeholder="冷箭竹"
          />
          <TextField
            label="Handle"
            value={draft.handle}
            onChange={(event) => update('handle', event.target.value)}
            placeholder="@naidragon"
            hint="社交平台上的统一昵称"
          />
          <TextField
            label="职位"
            required
            value={draft.role}
            error={errors.role}
            onChange={(event) => update('role', event.target.value)}
            placeholder="前端工程师"
          />
          <TextField
            label="所在地"
            value={draft.location}
            onChange={(event) => update('location', event.target.value)}
            placeholder="杭州"
          />
          <TextField
            label="邮箱"
            type="email"
            value={draft.email}
            error={errors.email}
            onChange={(event) => update('email', event.target.value)}
            placeholder="hello@example.com"
          />
          <TextField
            label="头像地址"
            value={draft.avatar}
            onChange={(event) => update('avatar', event.target.value)}
            placeholder="/avatar.svg"
            hint="留空则使用默认头像"
          />
        </div>

        <TextField
          label="一句话介绍"
          value={draft.tagline}
          onChange={(event) => update('tagline', event.target.value)}
          placeholder="把复杂的东西做得简单，顺便养了一只奶龙。"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <SwitchField
            label="正在寻找机会"
            description="开启后 Hero 头像旁会显示状态"
            checked={draft.availability.open}
            onChange={(open) =>
              update('availability', { ...draft.availability, open })
            }
          />
          <TextField
            label="机会标签"
            value={draft.availability.label}
            disabled={!draft.availability.open}
            onChange={(event) =>
              update('availability', { ...draft.availability, label: event.target.value })
            }
            placeholder="正在寻找新机会"
          />
        </div>
      </FormSection>

      <FormSection title="自我介绍" description="前台关于区按段落展示，空行分段。">
        <TextAreaField
          label="简介内容"
          value={bioText}
          onChange={(event) => setBioText(event.target.value)}
          hint="用空行分隔段落，建议 2–3 段。"
          rows={9}
        />
      </FormSection>

      <FormSection title="快速信息" description="关于区左侧的四个小卡片，可自由增删。">
        <QuickFactsEditor
          items={draft.quickFacts}
          onChange={(quickFacts) => update('quickFacts', quickFacts)}
        />
      </FormSection>

      <FormSection title="教育背景" description="按填写顺序展示，可添加多段经历。">
        <EducationEditor
          items={draft.education}
          onChange={(education) => update('education', education)}
        />
      </FormSection>

      <FormSection title="社交链接" description="图标决定前台的展示样式，链接建议填写完整地址。">
        <SocialsEditor items={draft.socials} onChange={(socials) => update('socials', socials)} />
      </FormSection>

      <div className="flex flex-wrap items-center justify-end gap-3 rounded-card border border-border bg-surface/60 p-4">
        {isDirty ? (
          <span className="mr-auto text-xs text-text-dim">有未保存的修改</span>
        ) : null}
        <Button variant="ghost" onClick={handleReset} disabled={!isDirty || saving}>
          撤销修改
        </Button>
        <Button type="submit" disabled={saving || !isDirty}>
          {saving ? '保存中…' : '保存资料'}
        </Button>
      </div>
    </form>
  );
}
