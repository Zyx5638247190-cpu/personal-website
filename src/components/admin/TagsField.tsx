import { useId, useState } from 'react';
import { CloseIcon } from '@/components/icons';
import { cn } from '@/lib/cn';

interface TagsFieldProps {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  hint?: string;
  error?: string;
  placeholder?: string;
}

/**
 * 标签输入：回车或逗号确认一个标签，退格删除最后一个。
 * 失焦时把输入框里剩下的文本也提交，避免用户打完字直接点保存丢标签。
 */
export function TagsField({
  label,
  value,
  onChange,
  hint,
  error,
  placeholder = '输入后按回车，例如：技术',
}: TagsFieldProps) {
  const [draft, setDraft] = useState('');
  const id = useId();

  const commit = (raw: string) => {
    const parts = raw
      .split(/[,，]/)
      .map((part) => part.trim())
      .filter(Boolean);
    if (!parts.length) return;
    onChange([...new Set([...value, ...parts])]);
    setDraft('');
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium tracking-wide text-text-muted">
        {label}
      </label>

      <div
        className={cn(
          'flex min-h-11 w-full flex-wrap items-center gap-2 rounded-card border bg-bg/60 px-2 py-1.5',
          'focus-within:border-primary-500/60',
          error ? 'border-red-400/60' : 'border-border'
        )}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex min-h-11 items-center gap-1 rounded-card border border-primary-500/40 bg-primary-500/10 py-1 pr-1 pl-2.5 text-xs text-primary-ink sm:min-h-8"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((item) => item !== tag))}
              aria-label={`移除标签 ${tag}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-primary-ink/70 transition hover:bg-primary-500/20 hover:text-primary-ink sm:h-6 sm:w-6"
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}

        <input
          id={id}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ',' || event.key === '，') {
              event.preventDefault();
              commit(draft);
            } else if (event.key === 'Backspace' && !draft && value.length > 0) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={() => commit(draft)}
          placeholder={value.length ? '' : placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className="h-9 min-w-[120px] flex-1 bg-transparent px-1 text-sm text-text outline-none placeholder:text-text-dim"
        />
      </div>

      {error ? (
        <p id={`${id}-error`} className="text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-text-dim">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
