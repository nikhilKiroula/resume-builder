import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from '@/store/authStore';
import useThemeStore from '@/store/themeStore';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

// Pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import EditorPage from '@/pages/EditorPage';
import SettingsPage from '@/pages/SettingsPage';
import PublicResumePage from '@/pages/PublicResumePage';
import NotFoundPage from '@/pages/NotFoundPage';

// Route guards
import ProtectedRoute from '@/routes/ProtectedRoute';
import GuestRoute from '@/routes/GuestRoute';

// Loading
import LoadingScreen from '@/components/ui/LoadingScreen';

function App() {
  const { isInitializing, initializeAuth, isAuthenticated } = useAuthStore();
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
    initializeAuth();
  }, []);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '10px',
            background: 'var(--toast-bg, #1e293b)',
            color: '#f8fafc',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      <Routes>
        {/* Public landing page */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Guest-only routes (redirect if already logged in) */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected dashboard routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          {/* Editor is full-screen — no dashboard sidebar */}
          <Route path="/editor/:id" element={<EditorPage />} />
        </Route>

        {/* Public resume view — no auth required */}
        <Route path="/resume/public/:slug" element={<PublicResumePage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
