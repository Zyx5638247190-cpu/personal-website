import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/** 后台表单分区卡片：标题 + 可选说明 + 内容 */
export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <section className={cn('rounded-card border border-border bg-surface/60', className)}>
      <header className="border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold text-text">{title}</h2>
        {description ? <p className="mt-1 text-xs text-text-dim">{description}</p> : null}
      </header>
      <div className="space-y-4 p-5">{children}</div>
    </section>
  );
}
