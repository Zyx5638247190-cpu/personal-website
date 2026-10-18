import { BlogSection } from '@/components/sections/BlogSection';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

export default function Blog() {
  useDocumentMeta({ title: '博客 · 奶龙小站', description: '关于前端、设计与做东西时想明白的小事。' });

  return (
    <div className="pt-24">
      <BlogSection showAllLink={false} showFilters headingLevel={1} />
    </div>
  );
}
