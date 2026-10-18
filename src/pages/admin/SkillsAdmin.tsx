import { useState } from 'react';
import { skillsApi } from '@/api/skills';
import type { SkillInput } from '@/api/skills';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useToast } from '@/hooks/useToast';
import { PageHeader } from '@/components/admin/PageHeader';
import { SkillDialog } from '@/components/admin/SkillDialog';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { IconActionButton } from '@/components/admin/RowActions';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { PencilIcon, PlusIcon, TechGlyph, TrashIcon } from '@/components/icons';
import { SKILL_LEVEL_LABEL } from '@/lib/skill-level';
import { errorMessage } from '@/lib/error';
import type { Skill } from '@/types/models';

interface EditingSkill {
  skill: Skill;
  category: string;
}

/** 技能管理：按分类分组展示，新建/编辑走弹窗，删除二次确认 */
export default function AdminSkills() {
  const { data, loading, error, refetch } = useAsync(() => skillsApi.list(), []);
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<EditingSkill | null>(null);
  const [deleting, setDeleting] = useState<Skill | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  useDocumentMeta({ title: '技能管理 · 奶龙后台' });

  const categories = data?.map((group) => group.category) ?? [];
  const total = data?.reduce((sum, group) => sum + group.items.length, 0) ?? 0;

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (skill: Skill, category: string) => {
    setEditing({ skill, category });
    setDialogOpen(true);
  };

  const handleSave = async (input: SkillInput) => {
    try {
      if (editing) await skillsApi.update(editing.skill.id, input);
      else await skillsApi.create(input);

      setDialogOpen(false);
      refetch();
      toast(editing ? '技能更新好了' : '嗷！技能加好了');
    } catch (reason) {
      toast(errorMessage(reason), 'error');
      throw reason;
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await skillsApi.remove(deleting.id);
      toast('技能删掉了');
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
        eyebrow="Skills"
        title="技能管理"
        description={
          total > 0
            ? `共 ${total} 项技能，分布在 ${categories.length} 个分类里。可以随时调整分类与熟练度。`
            : '记录你会的东西，前台会按分类和熟练度展示。'
        }
        actions={
          <Button size="sm" onClick={openCreate}>
            <PlusIcon />
            新建技能
          </Button>
        }
      />

      {error ? (
        <EmptyState
          mood="sad"
          title="技能清单被藏起来了"
          description="再翻一次口袋试试？"
          action={
            <Button size="sm" onClick={refetch}>
              重试
            </Button>
          }
        />
      ) : loading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-[180px]" />
          ))}
        </div>
      ) : total === 0 ? (
        <EmptyState
          mood="curious"
          title="还没有技能"
          description="先加第一个吧，分类可以之后再整理。"
          action={
            <Button size="sm" onClick={openCreate}>
              新建技能
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {data?.map((group) => (
            <section
              key={group.category}
              className="overflow-hidden rounded-card border border-border bg-surface/60"
            >
              <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                <h2 className="text-sm font-semibold text-text">{group.category}</h2>
                <span className="text-xs text-text-dim">{group.items.length} 项</span>
              </header>

              <ul className="divide-y divide-border">
                {group.items.map((skill) => (
                  <li key={skill.id} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-card border border-border bg-bg/40 text-primary-ink">
                      <TechGlyph name={skill.icon} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text">{skill.name}</p>
                      <p className="text-[11px] text-text-dim">
                        {skill.level} 格 · {SKILL_LEVEL_LABEL[skill.level]}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <IconActionButton
                        label={`编辑技能 ${skill.name}`}
                        onClick={() => openEdit(skill, group.category)}
                      >
                        <PencilIcon />
                      </IconActionButton>
                      <IconActionButton
                        label={`删除技能 ${skill.name}`}
                        tone="danger"
                        onClick={() => setDeleting(skill)}
                      >
                        <TrashIcon />
                      </IconActionButton>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {dialogOpen ? (
        <SkillDialog
          key={editing ? `${editing.skill.id}-${editing.category}` : 'new'}
          open
          initial={editing}
          categories={categories}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleSave}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="删除这个技能？"
        description={
          deleting
            ? `删除「${deleting.name}」后，前台技能区会立即移除它。这个操作不能撤销。`
            : ''
        }
        loading={deleteBusy}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
