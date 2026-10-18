import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'ghost' | 'danger';
type Size = 'md' | 'sm';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** 传入内部路由地址时渲染 Link */
  to?: string;
  /** 传入外部链接时渲染 a */
  href?: string;
  external?: boolean;
  children: ReactNode;
}

/** 按钮统一高度与圆角：20px 胶囊（AGENTS.md 5.2） */
function classes(variant: Variant, size: Size, className?: string): string {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-button font-medium transition',
    'disabled:cursor-not-allowed disabled:opacity-50',
    size === 'md' ? 'h-12 px-6 text-sm' : 'h-10 px-4 text-sm',
    variant === 'primary'
      ? 'bg-primary-gradient text-primary-contrast hover:brightness-105 active:brightness-95'
      : variant === 'danger'
        ? 'bg-red-500 text-white hover:bg-red-400 active:bg-red-600 disabled:hover:bg-red-500'
        : 'border border-primary-500/50 text-primary-ink hover:border-primary-500 hover:bg-primary-500/10',
    className
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  external = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const cls = classes(variant, size, className);

  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}
