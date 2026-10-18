import { cn } from '@/lib/cn';

/** 骨架占位：尺寸必须贴近真实内容，否则会引入 CLS */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded-card bg-surface-hover', className)}
      aria-hidden="true"
    />
  );
}

/** 文本区块骨架，用于关于/博客等以文字为主的加载态 */
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn('h-4', index === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  );
}
