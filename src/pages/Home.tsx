import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { BlogSection } from '@/components/sections/BlogSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

/** 首页：单页锚点结构，导航与页脚都指向这些区块 */
export default function Home() {
  useDocumentMeta({
    title: '奶龙小站 · 冷箭竹',
    description: '前端工程师冷箭竹的个人站：项目、技能、博客，以及一只用 SVG 画的黄色小奶龙。',
  });

  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection limit={3} />
      <BlogSection limit={3} />
      <ContactSection />
    </>
  );
}
