import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { iconActionClass } from './icon-action';

type Tone = 'default' | 'danger';

interface IconActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  tone?: Tone;
  children: ReactNode;
}

export function IconActionButton({
  label,
  tone = 'default',
  children,
  className,
  ...rest
}: IconActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={iconActionClass(tone, className)}
      {...rest}
    >
      {children}
    </button>
  );
}
