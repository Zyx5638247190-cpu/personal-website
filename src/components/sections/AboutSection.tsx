import { profileApi } from '@/api/profile';
import { experienceApi } from '@/api/experience';
import { useAsync } from '@/hooks/useAsync';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Skeleton, TextSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { DragonMascot } from '@/components/mascot/DragonMascot';
import { GraduationIcon } from '@/components/icons';
import { Reveal } from '@/components/ui/Reveal';
import { Tag } from '@/components/ui/Tag';

/** 关于区：简介 + 快速信息 + 教育背景 + 经历时间线 */
export function AboutSection({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const profile = useAsync(() => profileApi.get(), []);
  const experience = useAsync(() => experienceApi.list(), []);

  return (
    <section id="about" className="relative py-20 lg:py-28">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            level={headingLevel}
            eyebrow="关于"
            title="关于我，以及奶龙的来历"
            description="一个把「把东西做简单」当成职业习惯的前端工程师。奶龙是顺手养的，也是认真画的。"
          />
        </Reveal>

        {profile.error ? (
          <EmptyState
            mood="sad"
            title="奶龙没读出来我的故事…"
            description="再试一次？"
            action={<Button size="sm" onClick={profile.refetch}>重试</Button>}
          />
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <Reveal>
              <div className="space-y-5">
                {profile.loading ? (
                  <TextSkeleton lines={5} />
                ) : (
                  profile.data?.bio.map((paragraph) => (
                    <p key={paragraph.slice(0, 12)} className="text-sm leading-relaxed text-text-muted sm:text-base">
                      {paragraph}
                    </p>
                  ))
                )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {profile.loading
                    ? Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className="h-[74px]" />
                      ))
                    : profile.data?.quickFacts.map((fact) => (
                        <div
                          key={fact.label}
                          className="rounded-card border border-border bg-surface/50 p-3.5"
                        >
                          <p className="text-xs text-text-dim">{fact.label}</p>
                          <p className="mt-1 text-sm font-medium text-text">{fact.value}</p>
                        </div>
                      ))}
                </div>

                <div className="mt-2 rounded-card border border-border bg-surface/50 p-4">
                  <p className="flex items-center gap-2 text-xs tracking-widest text-text-dim uppercase">
                    <GraduationIcon />
                    教育背景
                  </p>
                  {profile.loading ? (
                    <Skeleton className="mt-3 h-5 w-2/3" />
                  ) : (
                    profile.data?.education.map((item) => (
                      <div key={item.school} className="mt-2">
                        <p className="text-sm font-medium text-text">
                          {item.school} · {item.major}
                        </p>
                        <p className="text-xs text-text-muted">
                          {item.degree} · {item.period}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text">经历时间线</h3>
                <DragonMascot size="sm" mood="curious" className="hidden sm:block" />
              </div>

              {experience.loading ? (
                <div className="mt-6 space-y-8">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="space-y-2 border-l border-border pl-6">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-5 w-52" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              ) : experience.error ? (
                <div className="mt-6">
                  <EmptyState
                    mood="sleepy"
                    title="时间线暂时睡着了"
                    action={<Button size="sm" onClick={experience.refetch}>叫醒它</Button>}
                  />
                </div>
              ) : (
                <ol className="mt-6 space-y-8 border-l border-border pl-6">
                  {experience.data?.map((item, index) => (
                    <li key={item.id} className="relative">
                      <span
                        className={[
                          'absolute top-1.5 -left-[31px] h-3 w-3 rounded-full border-2 border-bg',
                          index === 0 ? 'bg-primary-500 ring-4 ring-primary-500/15' : 'bg-text-dim',
                        ].join(' ')}
                        aria-hidden="true"
                      />
                      <p className="text-xs tracking-wide text-text-dim">{item.period}</p>
                      <h4 className="mt-1 text-base font-semibold text-text">
                        {item.role}
                        <span className="mx-1.5 text-text-dim">·</span>
                        <span className="text-text-muted">{item.org}</span>
                      </h4>
                      <ul className="mt-2 space-y-1.5">
                        {item.highlights.map((highlight) => (
                          <li
                            key={highlight}
                            className="flex gap-2 text-sm leading-relaxed text-text-muted"
                          >
                            <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-primary-500/70" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                      {item.tags?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <Tag key={tag}>{tag}</Tag>
                          ))}
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ol>
              )}
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
