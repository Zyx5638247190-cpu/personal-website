import { skillsApi } from '@/api/skills';
import { useAsync } from '@/hooks/useAsync';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SkillMeter } from '@/components/ui/SkillMeter';
import { TechGlyph } from '@/components/icons';
import { SKILL_LEVEL_LABEL } from '@/lib/skill-level';

/** 技能区：分类卡片 + 5 段式熟练度 */
export function SkillsSection({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const { data, loading, error, refetch } = useAsync(() => skillsApi.list(), []);

  return (
    <section id="skills" className="relative py-20 lg:py-28">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            level={headingLevel}
            eyebrow="技能"
            title="奶龙会的东西"
            description="用得上、改得动、讲得清的技术。熟练度是自评，5 格代表能独立解决该领域的大多数问题。"
          />
        </Reveal>

        {error ? (
          <EmptyState
            mood="sleepy"
            title="技能清单被奶龙藏起来了"
            description="再翻一次口袋试试？"
            action={<Button size="sm" onClick={refetch}>重试</Button>}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-card border border-border bg-surface/50 p-6"
                  >
                    <Skeleton className="h-5 w-28" />
                    <div className="mt-6 space-y-4">
                      {Array.from({ length: 3 }).map((__, row) => (
                        <Skeleton key={row} className="h-9 w-full" />
                      ))}
                    </div>
                  </div>
                ))
              : data?.map((group, groupIndex) => (
                  <Reveal key={group.category} delay={groupIndex * 80}>
                    <article className="group h-full rounded-card border border-border bg-surface/50 p-6 transition-colors hover:border-border-strong">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-text">{group.category}</h3>
                        <span className="text-xs text-text-dim">{group.items.length} 项</span>
                      </div>

                      <ul className="mt-5 space-y-4">
                        {group.items.map((skill, index) => (
                          <li key={skill.id} className="flex items-center gap-3">
                            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-bg/40 text-primary-ink transition-transform group-hover:scale-105">
                              <TechGlyph name={skill.icon} />
                            </span>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline justify-between gap-2">
                                <span className="truncate text-sm font-medium text-text">
                                  {skill.name}
                                </span>
                                <span className="shrink-0 text-[11px] text-text-dim">
                                  {SKILL_LEVEL_LABEL[skill.level]}
                                </span>
                              </div>

                              <SkillMeter name={skill.name} level={skill.level} delay={index * 60} />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </article>
                  </Reveal>
                ))}
          </div>
        )}
      </div>
    </section>
  );
}
