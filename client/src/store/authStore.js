import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/services/api';

/**
 * Auth store — manages access token (in memory) and user.
 * Refresh token lives in an httpOnly cookie handled by the browser.
 * Access token is kept in Zustand (not localStorage) for security.
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      isInitializing: true,

      // ─── Actions ─────────────────────────────────────────────────────────

      setTokens: (accessToken, user) => {
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        set({ accessToken, user, isAuthenticated: true });
      },

      clearAuth: () => {
        delete api.defaults.headers.common['Authorization'];
        set({ accessToken: null, user: null, isAuthenticated: false });
      },

      setUser: (user) => set({ user }),

      setLoading: (isLoading) => set({ isLoading }),

      // Called on app init — try to refresh from cookie
      initializeAuth: async () => {
        set({ isInitializing: true });
        try {
          const res = await api.post('/auth/refresh');
          if (res.data.success) {
            const { accessToken, user } = res.data;
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            set({ accessToken, user, isAuthenticated: true });
          }
        } catch {
          // No valid refresh token — user needs to log in
          set({ accessToken: null, user: null, isAuthenticated: false });
        } finally {
          set({ isInitializing: false });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/login', { email, password });
          const { accessToken, user } = res.data;
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          set({ accessToken, user, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          const message = err.response?.data?.message || 'Login failed';
          return { success: false, message };
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/register', { name, email, password });
          const { accessToken, user } = res.data;
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          set({ accessToken, user, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          const message = err.response?.data?.message || 'Registration failed';
          return { success: false, message };
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch {
          // Still clear local auth even if server call fails
        }
        delete api.defaults.headers.common['Authorization'];
        set({ accessToken: null, user: null, isAuthenticated: false });
      },

      updateUser: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),
    }),
    {
      name: 'resumely-auth',
      // Only persist user info — NOT the access token (session-scoped)
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
