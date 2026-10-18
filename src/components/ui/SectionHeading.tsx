import { cn } from '@/lib/cn';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  /**
   * 首页区块用 h2，独立页面（/blog、/projects 等）用 h1。
   * 每页只允许一个 h1，避免标题层级跳级。
   */
  level?: 1 | 2;
  className?: string;
}

/** 区块标题：eyebrow 小标签 + 标题 + 说明，统一全站节奏 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  level = 2,
  className,
}: SectionHeadingProps) {
  const Heading = level === 1 ? 'h1' : 'h2';

  return (
    <div
      className={cn(
        'mb-10 flex flex-col gap-3 lg:mb-14',
        align === 'center' && 'items-center text-center',
        className
      )}
    >
      <span className="inline-flex w-fit items-center gap-2 text-xs font-medium tracking-[0.2em] text-primary-ink uppercase">
        <span className="h-1.5 w-1.5 rounded-full bg-primary-500" aria-hidden="true" />
        {eyebrow}
      </span>
      <Heading
        className={cn(
          'font-bold text-text',
          level === 1 ? 'text-3xl sm:text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl lg:text-4xl'
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p className={cn('max-w-2xl text-sm text-text-muted sm:text-base', align === 'center' && 'mx-auto')}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
