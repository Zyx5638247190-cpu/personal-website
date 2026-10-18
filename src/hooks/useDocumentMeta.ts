import { useEffect } from 'react';

interface MetaOptions {
  title: string;
  description?: string;
}

/**
 * SPA 的轻量 SEO：切换路由时更新标题与描述。
 * 预渲染补上正文后，爬虫能拿到同样的信息。
 */
export function useDocumentMeta({ title, description }: MetaOptions): void {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    let meta: HTMLMetaElement | null = null;
    let previousDescription: string | null = null;

    if (description) {
      meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      previousDescription = meta.content;
      meta.content = description;
    }

    return () => {
      document.title = previousTitle;
      if (meta && previousDescription !== null) meta.content = previousDescription;
    };
  }, [title, description]);
}
