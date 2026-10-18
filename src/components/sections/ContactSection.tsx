import { profileApi } from '@/api/profile';
import { useAsync } from '@/hooks/useAsync';
import { useToast } from '@/hooks/useToast';
import { copyText } from '@/lib/copy';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { DragonMascot } from '@/components/mascot/DragonMascot';
import { CopyIcon, GithubIcon, JuejinIcon, MailIcon } from '@/components/icons';
import { Reveal } from '@/components/ui/Reveal';
import type { SocialIcon } from '@/types/models';

function SocialGlyph({ icon }: { icon: SocialIcon }) {
  switch (icon) {
    case 'github':
      return <GithubIcon />;
    case 'juejin':
      return <JuejinIcon />;
    default:
      return <MailIcon />;
  }
}

/** 联系区：邮箱（可复制）+ 社交链接，奶龙负责气氛 */
export function ContactSection({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const { data: profile, loading, error, refetch } = useAsync(() => profileApi.get(), []);
  const { toast } = useToast();

  const handleCopyEmail = async () => {
    if (!profile) return;
    const ok = await copyText(profile.email);
    toast(ok ? '嗷！邮箱复制好了' : '复制没成功，手动选一下吧', ok ? 'success' : 'error');
  };

  return (
    <section id="contact" className="relative py-20 lg:py-28">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            level={headingLevel}
            eyebrow="联系"
            title="要和奶龙聊聊吗？"
            description="工作机会、合作想法，或者只是想聊聊怎么把页面做得更有趣，都欢迎。"
          />
        </Reveal>

        {error ? (
          <EmptyState
            mood="sad"
            title="奶龙没找到邮箱…"
            action={<Button size="sm" onClick={refetch}>重试</Button>}
          />
        ) : (
          <Reveal>
            <div className="relative overflow-hidden rounded-card border border-border bg-surface/60 p-6 sm:p-10">
              <div
                className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-primary-500/10 blur-3xl"
                aria-hidden="true"
              />

              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs tracking-[0.18em] text-text-dim uppercase">Say hello</p>

                  {loading ? (
                    <Skeleton className="mt-3 h-9 w-64 max-w-full" />
                  ) : (
                    <a
                      href={`mailto:${profile?.email ?? ''}`}
                      className="mt-2 block truncate text-2xl font-semibold text-text transition-colors hover:text-primary-ink sm:text-3xl"
                    >
                      {profile?.email}
                    </a>
                  )}

                  <p className="mt-3 max-w-md text-sm leading-relaxed text-text-muted">
                    通常 24 小时内回复。如果邮件里带上了你的项目链接，奶龙会更开心。
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button href={`mailto:${profile?.email ?? ''}`} className="w-full sm:w-auto">
                      <MailIcon />
                      写封邮件
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleCopyEmail}
                      className="w-full sm:w-auto"
                    >
                      <CopyIcon />
                      复制邮箱
                    </Button>
                  </div>

                  <ul className="mt-7 flex flex-wrap gap-3">
                    {profile?.socials.map((social) => (
                      <li key={social.id}>
                        <a
                          href={social.href}
                          {...(social.href.startsWith('http')
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                          className="inline-flex items-center gap-2 rounded-button border border-border px-4 py-2.5 text-sm text-text-muted transition-colors hover:border-border-strong hover:text-primary-ink"
                        >
                          <SocialGlyph icon={social.icon} />
                          {social.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex shrink-0 justify-center lg:pl-8">
                  <DragonMascot
                    size="md"
                    mood="celebrate"
                    className="h-auto w-[170px] drop-shadow-[0_18px_36px_var(--primary-glow)] sm:w-[200px]"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
