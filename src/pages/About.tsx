import { AboutSection } from '@/components/sections/AboutSection';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

/** 独立关于页：直接复用首页区块，保证内容只有一份 */
export default function About() {
  useDocumentMeta({ title: '关于 · 奶龙小站', description: '冷箭竹的简介、经历时间线与教育背景。' });

  return (
    <div className="pt-24">
      <AboutSection headingLevel={1} />
    </div>
  );
}
