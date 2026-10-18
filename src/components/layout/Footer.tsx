import { Link } from 'react-router-dom';
import { SITE, NAV_SECTIONS } from '@/config';
import { DragonMascot } from '@/components/mascot/DragonMascot';
import { GithubIcon, MailIcon } from '@/components/icons';
import type { Profile } from '@/types/models';

interface FooterProps {
  /** 个人信息由布局层注入；未加载完成时回退到站点常量，避免页脚闪动 */
  profile?: Profile | null;
}

/** 页脚：品牌、锚点导航、社交入口、版权 */
export function Footer({ profile }: FooterProps) {
  const year = new Date().getFullYear();
  const owner = profile?.name || SITE.owner;
  const tagline = profile?.tagline || SITE.tagline;
  const email = profile?.email || SITE.email;

  return (
    <footer className="relative z-10 border-t border-border bg-bg/60 backdrop-blur-sm">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3 sm:col-span-2 lg:col-span-2">
          <div className="flex items-center gap-2.5 text-base font-semibold">
            <DragonMascot size={32} headOnly animated={false} />
            {SITE.name}
          </div>
          <p className="max-w-sm text-sm text-text-muted">{tagline}</p>
        </div>

        <nav aria-label="页脚导航">
          <h2 className="mb-3 text-xs font-medium tracking-[0.18em] text-text-dim uppercase">
            导航
          </h2>
          <ul className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-1">
            {NAV_SECTIONS.map((section) => (
              <li key={section.id}>
                <Link
                  to={`/#${section.id}`}
                  className="text-text-muted transition-colors hover:text-primary-ink"
                >
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 text-xs font-medium tracking-[0.18em] text-text-dim uppercase">
            找到我
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-text-muted transition-colors hover:text-primary-ink"
              >
                <GithubIcon /> GitHub
                <span className="text-xs text-text-dim">↗</span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 break-all text-text-muted transition-colors hover:text-primary-ink"
              >
                <MailIcon /> {email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-page border-t border-border py-6">
        <p className="text-xs text-text-dim">
          © {year} {owner} · 用 ❤️ 和奶龙一起搭建
        </p>
      </div>
    </footer>
  );
}
