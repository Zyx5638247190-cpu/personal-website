import { profileApi } from '@/api/profile';
import { useAsync } from '@/hooks/useAsync';
import { Button } from '@/components/ui/Button';
import { DragonMascot } from '@/components/mascot/DragonMascot';
import { ArrowRightIcon, MailIcon, MapPinIcon, SparkleIcon } from '@/components/icons';

/** 首页 Hero：左侧信息 + 右侧奶龙，星空背景由全局 Starfield 提供 */
export function HeroSection() {
  const { data: profile, loading } = useAsync(() => profileApi.get(), []);

  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <div className="order-2 flex flex-col items-start lg:order-1">
          <div className="flex items-center gap-3">
            <img
              src={profile?.avatar ?? '/avatar.svg'}
              alt={`${profile?.name ?? '冷箭竹'} 的头像`}
              width={56}
              height={56}
              className="h-14 w-14 rounded-full border-2 border-primary-500/50 object-cover ring-4 ring-primary-500/10"
            />
            {loading ? (
              <div className="h-6 w-40 animate-pulse rounded-full bg-surface-hover" />
            ) : (
              profile?.availability.open && (
                <span className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs text-primary-ink">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-500 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500" />
                  </span>
                  {profile.availability.label}
                </span>
              )
            )}
          </div>

          <h1 className="mt-6 text-4xl leading-[1.15] font-bold tracking-tight text-text sm:text-5xl lg:text-6xl">
            你好，我是{' '}
            <span className="text-gradient">{profile?.name ?? '冷箭竹'}</span>
            <DragonMascot
              size={44}
              headOnly
              animated={false}
              className="ml-2 inline-block h-[0.85em] w-[0.85em] translate-y-[0.06em] align-baseline"
            />
          </h1>

          <p className="mt-4 text-base font-medium text-text sm:text-lg">
            {profile?.role ?? '前端工程师'}
            <span className="mx-2 text-text-dim">·</span>
            <span className="text-text-muted">{profile?.tagline ?? '把复杂的东西做得简单。'}</span>
          </p>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-muted sm:text-base">
            喜欢把产品拆成清晰的小块，再用最少的代码拼回去。这个站点里的一切——包括那只奶龙——都是用代码画的。
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button to="/#projects" className="group w-full sm:w-auto">
              查看项目
              <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
            </Button>
            <Button to="/#contact" variant="ghost" className="w-full sm:w-auto">
              联系我
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-text-muted">
            {profile?.location ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPinIcon />
                {profile.location}
              </span>
            ) : null}
            {profile?.email ? (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-primary-ink"
              >
                <MailIcon className="h-4 w-4" />
                {profile.email}
              </a>
            ) : null}
          </div>
        </div>

        <div className="relative order-1 flex justify-center lg:order-2">
          {/* 光晕与轨道环都是纯 CSS，不额外请求图片 */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full hero-glow blur-3xl" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-500/15 sm:h-[340px] sm:w-[340px]" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary-500/10 sm:h-[280px] sm:w-[280px]" />

          <DragonMascot
            size="lg"
            mood="happy"
            followCursor
            className="relative h-auto w-[230px] drop-shadow-[0_24px_48px_var(--primary-glow)] sm:w-[280px] lg:w-[320px]"
            title="奶龙吉祥物"
          />

          <SparkleIcon className="absolute top-6 right-4 h-5 w-5 animate-[nd-float_5s_ease-in-out_infinite] text-primary-500/80" />
          <SparkleIcon className="absolute bottom-10 left-2 h-4 w-4 animate-[nd-float_6s_ease-in-out_infinite] text-primary-500/50" />
        </div>
      </div>
    </section>
  );
}
