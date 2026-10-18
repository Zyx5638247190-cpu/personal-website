import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { DragonMascot } from '@/components/mascot/DragonMascot';

// 后台整块按需加载：前台访客不会下载管理页面的代码
const AdminApp = lazy(() => import('@/pages/admin/AdminApp'));

/** 后台加载态：保持深色背景，避免白屏闪烁 */
function AdminFallback() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-bg">
      <DragonMascot size="sm" mood="sleepy" />
      <p className="text-sm text-text-muted">奶龙正在打开后台…</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminApp />
          </Suspense>
        }
      />
      <Route path="*" element={<SiteLayout />} />
    </Routes>
  );
}
