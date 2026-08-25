import { create } from 'zustand';

const DEFAULT_CUSTOMIZATION = {
  primaryColor: '#4f52e1',
  fontFamily: 'Inter',
  fontSize: 'medium',
  headingSize: 'large',
  lineSpacing: 'normal',
  sectionSpacing: 'normal',
  margins: 'normal',
};

const useEditorStore = create((set, get) => ({
  // The live resume data being edited
  resumeData: null,

  // Save status
  saveStatus: 'saved', // 'saved' | 'saving' | 'error'

  // Active section being edited
  activeSection: 'personalInfo',

  // Currently expanded sections
  expandedSections: new Set(['personalInfo']),

  // Mobile view mode
  mobileView: 'edit', // 'edit' | 'preview'

  // Customization panel open
  customizationOpen: false,

  // AI panel open
  aiPanelOpen: false,

  // ─── Init ─────────────────────────────────────────────────────────────
  initEditor: (resume) => {
    set({
      resumeData: resume,
      saveStatus: 'saved',
      activeSection: 'personalInfo',
      expandedSections: new Set(['personalInfo']),
    });
  },

  // ─── Update resume data ────────────────────────────────────────────────
  updateResumeData: (updates) => {
    set((state) => ({
      resumeData: state.resumeData ? { ...state.resumeData, ...updates } : null,
      saveStatus: 'saving',
    }));
  },

  // Update a specific section
  updateSection: (section, data) => {
    set((state) => ({
      resumeData: state.resumeData
        ? { ...state.resumeData, [section]: data }
        : null,
      saveStatus: 'saving',
    }));
  },

  // Update personalInfo field
  updatePersonalInfo: (field, value) => {
    set((state) => ({
      resumeData: state.resumeData
        ? {
            ...state.resumeData,
            personalInfo: { ...state.resumeData.personalInfo, [field]: value },
          }
        : null,
      saveStatus: 'saving',
    }));
  },

  // Update customization
  updateCustomization: (updates) => {
    set((state) => ({
      resumeData: state.resumeData
        ? {
            ...state.resumeData,
            customization: { ...state.resumeData.customization, ...updates },
          }
        : null,
      saveStatus: 'saving',
    }));
  },

  // ─── Save status ───────────────────────────────────────────────────────
  setSaveStatus: (saveStatus) => set({ saveStatus }),

  // ─── UI state ──────────────────────────────────────────────────────────
  setActiveSection: (activeSection) => set({ activeSection }),

  toggleSection: (section) => {
    set((state) => {
      const next = new Set(state.expandedSections);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return { expandedSections: next };
    });
  },

  expandSection: (section) => {
    set((state) => {
      const next = new Set(state.expandedSections);
      next.add(section);
      return { expandedSections: next };
    });
  },

  setMobileView: (mobileView) => set({ mobileView }),

  toggleCustomization: () => set((state) => ({ customizationOpen: !state.customizationOpen })),
  setCustomizationOpen: (open) => set({ customizationOpen: open }),

  toggleAIPanel: () => set((state) => ({ aiPanelOpen: !state.aiPanelOpen })),
  setAIPanelOpen: (open) => set({ aiPanelOpen: open }),

  clearEditor: () =>
    set({
      resumeData: null,
      saveStatus: 'saved',
      activeSection: 'personalInfo',
      expandedSections: new Set(['personalInfo']),
      customizationOpen: false,
      aiPanelOpen: false,
    }),
}));

export default useEditorStore;
