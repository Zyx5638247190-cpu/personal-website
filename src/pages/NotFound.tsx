import { Link } from 'react-router-dom';
import { DragonMascot } from '@/components/mascot/DragonMascot';
import { ArrowRightIcon } from '@/components/icons';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

export default function NotFound() {
  useDocumentMeta({ title: '404 · 奶龙小站' });

  return (
    <div className="flex min-h-[80dvh] items-center justify-center px-6 pt-24 pb-16">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <DragonMascot size="lg" mood="sad" title="抱着 404 牌子的奶龙" />
        <div className="space-y-2">
          <p className="text-sm font-medium tracking-[0.3em] text-primary-ink">404</p>
          <h1 className="text-2xl font-bold text-text sm:text-3xl">走丢了！这里没有星星</h1>
          <p className="text-sm text-text-muted">
            奶龙举着牌子在原地等你，回奶龙窝看看吧。
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-button bg-primary-gradient px-6 text-sm font-medium text-primary-contrast"
        >
          回奶龙窝
          <ArrowRightIcon />
        </Link>
      </div>
    </div>
  );
}
