import { create } from 'zustand';
import api from '@/services/api';
import toast from 'react-hot-toast';

const useResumeStore = create((set, get) => ({
  resumes: [],
  currentResume: null,
  isLoading: false,
  isCreating: false,
  isDeleting: null, // ID being deleted

  // ─── Fetch all resumes ──────────────────────────────────────────────────
  fetchResumes: async (params = {}) => {
    set({ isLoading: true });
    try {
      const res = await api.get('/resumes', { params });
      set({ resumes: res.data.resumes, isLoading: false });
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, message: err.response?.data?.message || 'Failed to load resumes' };
    }
  },

  // ─── Fetch single resume ────────────────────────────────────────────────
  fetchResume: async (id) => {
    set({ isLoading: true });
    try {
      const res = await api.get(`/resumes/${id}`);
      set({ currentResume: res.data.resume, isLoading: false });
      return { success: true, resume: res.data.resume };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, message: err.response?.data?.message || 'Resume not found' };
    }
  },

  // ─── Create resume ──────────────────────────────────────────────────────
  createResume: async (data = {}) => {
    set({ isCreating: true });
    try {
      const res = await api.post('/resumes', data);
      const newResume = res.data.resume;
      set((state) => ({
        resumes: [newResume, ...state.resumes],
        isCreating: false,
      }));
      return { success: true, resume: newResume };
    } catch (err) {
      set({ isCreating: false });
      return { success: false, message: err.response?.data?.message || 'Failed to create resume' };
    }
  },

  // ─── Update resume ──────────────────────────────────────────────────────
  updateResume: async (id, data) => {
    try {
      const res = await api.put(`/resumes/${id}`, data);
      const updated = res.data.resume;
      set((state) => ({
        currentResume: state.currentResume?._id === id ? updated : state.currentResume,
        resumes: state.resumes.map((r) => (r._id === id ? updated : r)),
      }));
      return { success: true, resume: updated };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to save resume' };
    }
  },

  // ─── Delete resume ──────────────────────────────────────────────────────
  deleteResume: async (id) => {
    set({ isDeleting: id });
    try {
      await api.delete(`/resumes/${id}`);
      set((state) => ({
        resumes: state.resumes.filter((r) => r._id !== id),
        isDeleting: null,
      }));
      toast.success('Resume deleted');
      return { success: true };
    } catch (err) {
      set({ isDeleting: null });
      toast.error('Failed to delete resume');
      return { success: false };
    }
  },

  // ─── Duplicate resume ───────────────────────────────────────────────────
  duplicateResume: async (id) => {
    try {
      const res = await api.post(`/resumes/${id}/duplicate`);
      const dup = res.data.resume;
      set((state) => ({ resumes: [dup, ...state.resumes] }));
      toast.success('Resume duplicated');
      return { success: true, resume: dup };
    } catch (err) {
      toast.error('Failed to duplicate resume');
      return { success: false };
    }
  },

  // ─── Toggle public ──────────────────────────────────────────────────────
  togglePublic: async (id) => {
    try {
      const res = await api.patch(`/resumes/${id}/public`);
      const { isPublic, publicSlug } = res.data;
      set((state) => ({
        resumes: state.resumes.map((r) =>
          r._id === id ? { ...r, isPublic, publicSlug } : r
        ),
        currentResume:
          state.currentResume?._id === id
            ? { ...state.currentResume, isPublic, publicSlug }
            : state.currentResume,
      }));
      return { success: true, isPublic, publicSlug };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  },

  // ─── Set current resume locally (for editor) ────────────────────────────
  setCurrentResume: (resume) => set({ currentResume: resume }),

  // ─── Update current resume in memory (optimistic for editor) ───────────
  updateCurrentResume: (updates) =>
    set((state) => ({
      currentResume: state.currentResume
        ? { ...state.currentResume, ...updates }
        : state.currentResume,
    })),

  clearCurrentResume: () => set({ currentResume: null }),
}));

export default useResumeStore;
