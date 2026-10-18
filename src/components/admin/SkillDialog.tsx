import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import { Dialog } from './Dialog';
import { Button } from '@/components/ui/Button';
import { SelectField, TextField } from './FormControls';
import { SKILL_LEVEL_LABEL, SKILL_LEVELS } from '@/lib/skill-level';
import type { SkillInput } from '@/api/skills';
import type { Skill, SkillLevel } from '@/types/models';

const ICON_OPTIONS = [
  { value: 'react', label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'tailwind', label: 'Tailwind CSS' },
  { value: 'vite', label: 'Vite' },
  { value: 'node', label: 'Node.js' },
  { value: 'postgres', label: 'PostgreSQL' },
  { value: 'git', label: 'Git' },
  { value: 'docker', label: 'Docker' },
  { value: 'ci', label: 'CI / CD' },
  { value: 'figma', label: 'Figma' },
  { value: 'svg', label: 'SVG 插画' },
  { value: 'custom', label: '通用图形' },
];

interface SkillDialogProps {
  open: boolean;
  initial?: { skill: Skill; category: string } | null;
  categories: string[];
  onClose: () => void;
  onSubmit: (input: SkillInput) => Promise<void>;
}

/** 技能新建/编辑弹窗；外层用 key 控制重挂载，保证每次打开都是干净的初始值 */
export function SkillDialog({
  open,
  initial,
  categories,
  onClose,
  onSubmit,
}: SkillDialogProps) {
  const [name, setName] = useState(initial?.skill.name ?? '');
  const [category, setCategory] = useState(
    initial?.category ?? categories[0] ?? '前端'
  );
  const [icon, setIcon] = useState(initial?.skill.icon ?? 'custom');
  const [level, setLevel] = useState<SkillLevel>(initial?.skill.level ?? 3);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const listId = useId();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!name.trim()) {
      setError('技能名称不能为空');
      return;
    }
    if (!category.trim()) {
      setError('分类不能为空');
      return;
    }
    setError(null);

    setSaving(true);
    try {
      await onSubmit({ name: name.trim(), category: category.trim(), icon, level });
    } catch {
      // 具体错误由父级统一 toast，弹窗保持打开让用户继续修改
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      title={initial ? '编辑技能' : '新建技能'}
      description="技能会按分类分组展示在首页与技能页。"
      size="sm"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={saving}>
            取消
          </Button>
          <Button type="submit" size="sm" form="skill-form" disabled={saving}>
            {saving ? '保存中…' : '保存技能'}
          </Button>
        </>
      }
    >
      <form id="skill-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextField
          label="技能名称"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="React"
          error={error && !name.trim() ? error : undefined}
          data-autofocus
        />

        <TextField
          label="分类"
          required
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          list={listId}
          placeholder="前端"
          hint="可以输入新分类，保存后自动创建分组"
          error={error && !category.trim() ? error : undefined}
        />
        <datalist id={listId}>
          {categories.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="图标"
            value={icon}
            onChange={(event) => setIcon(event.target.value)}
          >
            {ICON_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>

          <SelectField
            label="熟练度"
            value={level}
            onChange={(event) => setLevel(Number(event.target.value) as SkillLevel)}
          >
            {SKILL_LEVELS.map((value) => (
              <option key={value} value={value}>
                {value} 格 · {SKILL_LEVEL_LABEL[value]}
              </option>
            ))}
          </SelectField>
        </div>

        {error && name.trim() && category.trim() ? (
          <p className="text-xs text-danger">{error}</p>
        ) : null}
      </form>
    </Dialog>
  );
}
