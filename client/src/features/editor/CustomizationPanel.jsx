import { X, Palette } from 'lucide-react';
import useEditorStore from '@/store/editorStore';

const TEMPLATES = [
  { id: 'modern', name: 'Modern', color: 'from-blue-500 to-indigo-600' },
  { id: 'classic', name: 'Classic', color: 'from-slate-600 to-slate-800' },
  { id: 'minimal', name: 'Minimal', color: 'from-emerald-500 to-teal-600' },
  { id: 'professional', name: 'Professional', color: 'from-violet-500 to-purple-600' },
  { id: 'creative', name: 'Creative', color: 'from-orange-500 to-rose-600' },
  { id: 'ats', name: 'ATS', color: 'from-sky-500 to-cyan-600' },
];

const FONTS = ['Inter', 'Georgia', 'Arial', 'Times New Roman', 'Roboto', 'Open Sans'];
const FONT_SIZES = ['small', 'medium', 'large'];
const SPACINGS = ['compact', 'normal', 'relaxed'];

const PRESET_COLORS = [
  '#4f52e1', '#2563eb', '#7c3aed', '#db2777', '#dc2626',
  '#ea580c', '#16a34a', '#0891b2', '#1e293b', '#374151',
];

const CustomizationPanel = () => {
  const { resumeData, updateResumeData, updateCustomization, setCustomizationOpen } = useEditorStore();
  const custom = resumeData?.customization || {};

  const setTemplate = (tpl) => updateResumeData({ selectedTemplate: tpl });
  const setColor = (color) => updateCustomization({ primaryColor: color });
  const setFont = (fontFamily) => updateCustomization({ fontFamily });
  const setFontSize = (fontSize) => updateCustomization({ fontSize });
  const setSpacing = (lineSpacing) => updateCustomization({ lineSpacing });
  const setSectionSpacing = (sectionSpacing) => updateCustomization({ sectionSpacing });

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-brand-600" />
          <span className="text-sm font-semibold text-slate-900 dark:text-white">Customize</span>
        </div>
        <button onClick={() => setCustomizationOpen(false)} className="btn-ghost p-1 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Template */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Template</h3>
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATES.map(({ id, name, color }) => (
              <button
                key={id}
                onClick={() => setTemplate(id)}
                className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                  resumeData?.selectedTemplate === id
                    ? 'border-brand-600 ring-2 ring-brand-600/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-brand-300'
                }`}
              >
                <div className={`h-14 bg-gradient-to-br ${color}`} />
                <div className="py-1.5 text-center bg-white dark:bg-slate-900">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{name}</span>
                </div>
                {resumeData?.selectedTemplate === id && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-brand-600 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Primary color */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Primary Color</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${
                  custom.primaryColor === c ? 'ring-2 ring-offset-2 ring-brand-500 scale-110' : ''
                }`}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={custom.primaryColor || '#4f52e1'}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-slate-200"
              aria-label="Custom color"
            />
            <input
              type="text"
              value={custom.primaryColor || '#4f52e1'}
              onChange={(e) => setColor(e.target.value)}
              className="input text-sm flex-1 font-mono"
              placeholder="#4f52e1"
              maxLength={7}
            />
          </div>
        </div>

        {/* Font */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Font Family</h3>
          <select value={custom.fontFamily || 'Inter'} onChange={(e) => setFont(e.target.value)} className="input text-sm w-full">
            {FONTS.map((f) => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
          </select>
        </div>

        {/* Font size */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Font Size</h3>
          <div className="flex gap-2">
            {FONT_SIZES.map((s) => (
              <button key={s} onClick={() => setFontSize(s)}
                className={`flex-1 py-1.5 text-xs rounded-lg border capitalize transition-colors ${custom.fontSize === s ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/30 text-brand-700' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-300'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Line spacing */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Line Spacing</h3>
          <div className="flex gap-2">
            {SPACINGS.map((s) => (
              <button key={s} onClick={() => setSpacing(s)}
                className={`flex-1 py-1.5 text-xs rounded-lg border capitalize transition-colors ${custom.lineSpacing === s ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/30 text-brand-700' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-300'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Section spacing */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Section Spacing</h3>
          <div className="flex gap-2">
            {SPACINGS.map((s) => (
              <button key={s} onClick={() => setSectionSpacing(s)}
                className={`flex-1 py-1.5 text-xs rounded-lg border capitalize transition-colors ${custom.sectionSpacing === s ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/30 text-brand-700' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-300'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;
