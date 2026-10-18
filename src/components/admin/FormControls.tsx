import { useId } from 'react';
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/lib/cn';

/** 表单控件统一样式：8px 圆角与卡片一致，高度不低于 44px 方便触屏 */
const CONTROL = [
  'w-full rounded-card border border-border bg-bg/60 px-3.5 text-sm text-text',
  'placeholder:text-text-dim transition-colors',
  'hover:border-border-strong focus:border-primary-500/60 focus:outline-none',
  'disabled:cursor-not-allowed disabled:opacity-60',
].join(' ');

interface FieldShellProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

/** 标签 + 控件 + 提示/错误的统一外壳，保证所有表单对齐 */
function FieldShell({
  id,
  label,
  hint,
  error,
  required,
  className,
  children,
}: FieldShellProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-xs font-medium tracking-wide text-text-muted">
        {label}
        {required ? (
          <span className="ml-1 text-primary-ink" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
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

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  id?: string;
  hint?: string;
  error?: string;
  /** 作用在外层 FieldShell 上，用于栅格/弹性布局 */
  containerClassName?: string;
}

export function TextField({
  label,
  id,
  hint,
  error,
  className,
  containerClassName,
  required,
  ...rest
}: TextFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <FieldShell
      id={fieldId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={containerClassName}
    >
      <input
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
        className={cn(CONTROL, 'h-11', className)}
        {...rest}
      />
    </FieldShell>
  );
}

interface TextAreaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  id?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export function TextAreaField({
  label,
  id,
  hint,
  error,
  className,
  containerClassName,
  required,
  ...rest
}: TextAreaFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <FieldShell
      id={fieldId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={containerClassName}
    >
      <textarea
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
        className={cn(CONTROL, 'min-h-[120px] resize-y py-2.5 leading-relaxed', className)}
        {...rest}
      />
    </FieldShell>
  );
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label: string;
  id?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export function SelectField({
  label,
  id,
  hint,
  error,
  className,
  containerClassName,
  required,
  children,
  ...rest
}: SelectFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <FieldShell
      id={fieldId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={containerClassName}
    >
      <select
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
        className={cn(CONTROL, 'h-11', className)}
        {...rest}
      >
        {children}
      </select>
    </FieldShell>
  );
}

interface SwitchFieldProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

/** 布尔开关：用 button + role="switch"，44px 触控目标，键盘 Space/Enter 可用 */
export function SwitchField({
  label,
  description,
  checked,
  onChange,
  id,
}: SwitchFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <div className="flex items-center justify-between gap-4 rounded-card border border-border bg-bg/40 p-3.5">
      <div className="min-w-0">
        <p id={`${fieldId}-label`} className="text-sm font-medium text-text">
          {label}
        </p>
        {description ? <p className="mt-0.5 text-xs text-text-dim">{description}</p> : null}
      </div>
      <button
        id={fieldId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${fieldId}-label`}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-11 w-[68px] shrink-0 items-center rounded-full border px-1 transition-colors',
          checked
            ? 'border-primary-500/60 bg-primary-500/25'
            : 'border-border bg-surface-hover'
        )}
      >
        <span
          className={cn(
            'inline-block h-7 w-7 rounded-full transition-transform',
            checked ? 'translate-x-[26px] bg-primary-500' : 'translate-x-0 bg-text-dim'
          )}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
