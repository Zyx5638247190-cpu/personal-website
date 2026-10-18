import type { ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AdminAuthProvider } from '@/context/AdminAuthProvider';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Starfield } from '@/components/background/Starfield';
import { AdminLayout } from '@/components/admin/AdminLayout';
import AdminLogin from './Login';
import AdminDashboard from './Dashboard';
import AdminProfile from './ProfileAdmin';
import AdminSkills from './SkillsAdmin';
import AdminProjects from './ProjectsAdmin';
import AdminProjectEditor from './ProjectEditor';
import AdminPosts from './PostsAdmin';
import AdminPostEditor from './PostEditor';
import AdminNotFound from './AdminNotFound';

/** 路由守卫：未登录统一送到登录页，并记住原本要去的地址 */
function RequireAuth({ children }: { children: ReactNode }) {
  const { session } = useAdminAuth();
  const location = useLocation();

  if (!session) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }
  return <>{children}</>;
}

/**
 * 后台入口：与前台共用同一个 BrowserRouter，但拥有独立的布局、登录态与路由表。
 * 该组件由 App 懒加载，前台首屏不会带上后台代码。
 */
export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <div className="relative min-h-dvh">
        <Starfield />
        <div className="relative z-10">
          <Routes>
            <Route path="login" element={<AdminLogin />} />

            <Route
              element={
                <RequireAuth>
                  <AdminLayout />
                </RequireAuth>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="skills" element={<AdminSkills />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="projects/new" element={<AdminProjectEditor />} />
              <Route path="projects/:slug/edit" element={<AdminProjectEditor />} />
              <Route path="posts" element={<AdminPosts />} />
              <Route path="posts/new" element={<AdminPostEditor />} />
              <Route path="posts/:slug/edit" element={<AdminPostEditor />} />
              <Route path="*" element={<AdminNotFound />} />
            </Route>
          </Routes>
        </div>
      </div>
    </AdminAuthProvider>
  );
}
