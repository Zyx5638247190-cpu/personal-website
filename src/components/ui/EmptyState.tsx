import type { ReactNode } from 'react';
import { DragonMascot } from '@/components/mascot/DragonMascot';
import type { Mood } from '@/types/models';

interface EmptyStateProps {
  mood?: Mood;
  title: string;
  description?: string;
  action?: ReactNode;
}

/** 空状态统一形态：奶龙 + 一句人话 + 一个出口 */
export function EmptyState({ mood = 'curious', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-card border border-dashed border-border px-6 py-12 text-center">
      <DragonMascot size="sm" mood={mood} />
      <div className="space-y-1">
        <p className="text-base font-medium text-text">{title}</p>
        {description ? <p className="text-sm text-text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
