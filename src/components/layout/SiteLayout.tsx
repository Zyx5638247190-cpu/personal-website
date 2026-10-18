import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Starfield } from '@/components/background/Starfield';
import { BackToTop } from '@/components/ui/BackToTop';
import { DragonMascot } from '@/components/mascot/DragonMascot';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Skills from '@/pages/Skills';
import Projects from '@/pages/Projects';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useAsync } from '@/hooks/useAsync';
import { profileApi } from '@/api/profile';

// 博客相关页面按需加载，首屏只保留首页所需代码
const Blog = lazy(() => import('@/pages/Blog'));
const PostDetail = lazy(() => import('@/pages/PostDetail'));

/** 路由切换后的滚动：有 hash 定位到区块，否则回到顶部 */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        // 等一帧，确保跨页跳转时目标区块已挂载
        const frame = window.requestAnimationFrame(() => {
          target.scrollIntoView({
            behavior: reduced ? 'auto' : 'smooth',
            block: 'start',
          });
        });
        return () => window.cancelAnimationFrame(frame);
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, hash, reduced]);

  return null;
}

/** 博客路由的轻量加载态，避免白屏 */
function PageLoader() {
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-3">
      <DragonMascot size="sm" mood="sleepy" />
      <p className="text-sm text-text-muted">奶龙正在搬砖…嗷！</p>
    </div>
  );
}

/**
 * 前台布局：星空 + 导航 + 路由 + 页脚。
 * 后台 /admin/* 不走这里，避免把前台 Navbar 带进管理界面。
 */
export function SiteLayout() {
  // 页脚也需要个人信息（昵称、简介、邮箱），由布局统一取一次，避免每个区块重复请求
  const { data: profile } = useAsync(() => profileApi.get(), []);

  return (
    <div className="relative flex min-h-dvh flex-col">
      <Starfield />
      <a href="#main" className="skip-link">
        跳到主要内容
      </a>
      <Navbar />

      <main id="main" className="relative z-10 flex-1">
        <ScrollManager />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<PostDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer profile={profile} />
      <BackToTop />
    </div>
  );
}
