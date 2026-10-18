import { SkillsSection } from '@/components/sections/SkillsSection';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

export default function Skills() {
  useDocumentMeta({ title: '技能 · 奶龙小站', description: '前端、后端、工程化与设计相关的技能清单。' });

  return (
    <div className="pt-24">
      <SkillsSection headingLevel={1} />
    </div>
  );
}
