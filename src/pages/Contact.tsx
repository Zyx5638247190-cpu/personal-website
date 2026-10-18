import { ContactSection } from '@/components/sections/ContactSection';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

export default function Contact() {
  useDocumentMeta({ title: '联系 · 奶龙小站', description: '邮件、GitHub 与其他联系方式。' });

  return (
    <div className="pt-24">
      <ContactSection headingLevel={1} />
    </div>
  );
}
