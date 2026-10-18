import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

export default function Projects() {
  useDocumentMeta({ title: '项目 · 奶龙小站', description: '冷箭竹做过的项目：技术栈、说明与链接。' });

  return (
    <div className="pt-24">
      <ProjectsSection showFilters headingLevel={1} />
    </div>
  );
}
