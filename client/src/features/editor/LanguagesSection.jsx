import { Globe, Plus, Trash2 } from 'lucide-react';
import useEditorStore from '@/store/editorStore';
import EditorSection from './EditorSection';

const PROFICIENCY = ['Elementary', 'Limited Working', 'Professional Working', 'Full Professional', 'Native / Bilingual'];

const LanguagesSection = () => {
  const { resumeData, updateSection } = useEditorStore();
  const items = resumeData?.languages || [];
  const setItems = (v) => updateSection('languages', v);
  // tempKey used only as React key — never sent to DB as _id
  const addItem = () => setItems([...items, { language: '', proficiency: 'Professional Working', tempKey: `temp_${Date.now()}_${Math.random().toString(36).slice(2)}` }]);
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx, field, val) => setItems(items.map((item, i) => i === idx ? { ...item, [field]: val } : item));

  return (
    <EditorSection title="Languages" icon={Globe} badge={items.length || undefined}>
      <div className="space-y-2">
        <button onClick={addItem} className="btn btn-secondary btn-sm w-full"><Plus className="w-3.5 h-3.5" /> Add Language</button>
        {items.map((lang, idx) => (
          <div key={lang._id || lang.tempKey || idx} className="flex items-center gap-2">
            <input type="text" value={lang.language} onChange={(e) => updateItem(idx, 'language', e.target.value)} className="input text-sm flex-1" placeholder="English" />
            <select value={lang.proficiency} onChange={(e) => updateItem(idx, 'proficiency', e.target.value)} className="input text-sm w-44">
              {PROFICIENCY.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <button onClick={() => removeItem(idx)} className="btn-ghost p-1.5 rounded text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-slate-400 text-center py-2">No languages added yet</p>}
      </div>
    </EditorSection>
  );
};

export default LanguagesSection;
