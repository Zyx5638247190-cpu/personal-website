import { Button } from '@/components/ui/Button';
import { PlusIcon, TrashIcon } from '@/components/icons';
import { SelectField, TextField } from './FormControls';
import type { Education, QuickFact, SocialIcon, SocialLink } from '@/types/models';

const SOCIAL_ICON_OPTIONS: SocialIcon[] = ['github', 'mail', 'juejin', 'x', 'wechat', 'rss'];

/** 重复行右侧的删除按钮：44px 触控目标，桌面稍紧凑 */
function RowRemove({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-card border border-transparent text-text-dim transition-colors hover:border-red-400/40 hover:bg-red-500/10 hover:text-danger"
    >
      <TrashIcon />
    </button>
  );
}

function AddRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button variant="ghost" size="sm" onClick={onClick}>
      <PlusIcon />
      {label}
    </Button>
  );
}

export function QuickFactsEditor({
  items,
  onChange,
}: {
  items: QuickFact[];
  onChange: (next: QuickFact[]) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex items-end gap-2">
          <TextField
            containerClassName="flex-1"
            label="标签"
            value={item.label}
            onChange={(event) =>
              onChange(
                items.map((row, rowIndex) =>
                  rowIndex === index ? { ...row, label: event.target.value } : row
                )
              )
            }
            placeholder="所在地"
          />
          <TextField
            containerClassName="flex-[1.5]"
            label="内容"
            value={item.value}
            onChange={(event) =>
              onChange(
                items.map((row, rowIndex) =>
                  rowIndex === index ? { ...row, value: event.target.value } : row
                )
              )
            }
            placeholder="杭州 · 中国"
          />
          <RowRemove
            label={`删除第 ${index + 1} 条快速信息`}
            onClick={() => onChange(items.filter((_, rowIndex) => rowIndex !== index))}
          />
        </div>
      ))}
      <AddRow label="添加快速信息" onClick={() => onChange([...items, { label: '', value: '' }])} />
    </div>
  );
}

export function EducationEditor({
  items,
  onChange,
}: {
  items: Education[];
  onChange: (next: Education[]) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="rounded-card border border-border bg-bg/30 p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ['学校', 'school', '某某大学'],
                ['专业', 'major', '计算机科学与技术'],
                ['学历', 'degree', '本科'],
                ['时间段', 'period', '2017 — 2021'],
              ] as const
            ).map(([label, key, placeholder]) => (
              <TextField
                key={key}
                label={label}
                value={item[key]}
                onChange={(event) =>
                  onChange(
                    items.map((row, rowIndex) =>
                      rowIndex === index ? { ...row, [key]: event.target.value } : row
                    )
                  )
                }
                placeholder={placeholder}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-end">
            <RowRemove
              label={`删除第 ${index + 1} 条教育经历`}
              onClick={() => onChange(items.filter((_, rowIndex) => rowIndex !== index))}
            />
          </div>
        </div>
      ))}
      <AddRow
        label="添加教育经历"
        onClick={() =>
          onChange([...items, { school: '', major: '', degree: '', period: '' }])
        }
      />
    </div>
  );
}

export function SocialsEditor({
  items,
  onChange,
}: {
  items: SocialLink[];
  onChange: (next: SocialLink[]) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item.id} className="grid items-end gap-2 sm:grid-cols-[130px_1fr_1.6fr_auto]">
          <SelectField
            label="图标"
            value={item.icon}
            onChange={(event) =>
              onChange(
                items.map((row, rowIndex) =>
                  rowIndex === index ? { ...row, icon: event.target.value as SocialIcon } : row
                )
              )
            }
          >
            {SOCIAL_ICON_OPTIONS.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </SelectField>
          <TextField
            label="名称"
            value={item.label}
            onChange={(event) =>
              onChange(
                items.map((row, rowIndex) =>
                  rowIndex === index ? { ...row, label: event.target.value } : row
                )
              )
            }
            placeholder="GitHub"
          />
          <TextField
            label="链接"
            value={item.href}
            onChange={(event) =>
              onChange(
                items.map((row, rowIndex) =>
                  rowIndex === index ? { ...row, href: event.target.value } : row
                )
              )
            }
            placeholder="https://github.com/you"
          />
          <RowRemove
            label={`删除第 ${index + 1} 个社交链接`}
            onClick={() => onChange(items.filter((_, rowIndex) => rowIndex !== index))}
          />
        </div>
      ))}
      <AddRow
        label="添加社交链接"
        onClick={() =>
          onChange([
            ...items,
            {
              // 新增行用时间戳生成 id，保证 React key 稳定且不与已有 id 冲突
              id: `social-${Date.now().toString(36)}`,
              label: '',
              href: '',
              icon: 'github',
            },
          ])
        }
      />
    </div>
  );
}
