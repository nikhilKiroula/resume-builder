import { Star, Plus, Trash2 } from 'lucide-react';
import useEditorStore from '@/store/editorStore';
import EditorSection from './EditorSection';

const AchievementsSection = () => {
  const { resumeData, updateSection } = useEditorStore();
  const items = resumeData?.achievements || [];
  const setItems = (v) => updateSection('achievements', v);
  // tempKey used only as React key — never sent to DB as _id
  const addItem = () => setItems([...items, { title: '', description: '', tempKey: `temp_${Date.now()}_${Math.random().toString(36).slice(2)}` }]);
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx, field, val) => setItems(items.map((item, i) => i === idx ? { ...item, [field]: val } : item));

  return (
    <EditorSection title="Achievements" icon={Star} badge={items.length || undefined}>
      <div className="space-y-3">
        <button onClick={addItem} className="btn btn-secondary btn-sm w-full"><Plus className="w-3.5 h-3.5" /> Add Achievement</button>
        {items.map((ach, idx) => (
          <div key={ach._id || ach.tempKey || idx} className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 bg-white dark:bg-slate-900 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{ach.title || 'New Achievement'}</span>
              <button onClick={() => removeItem(idx)} className="btn-ghost p-1 rounded text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
            <div>
              <label className="label text-xs">Title</label>
              <input type="text" value={ach.title} onChange={(e) => updateItem(idx, 'title', e.target.value)} className="input text-sm" placeholder="Employee of the Month" />
            </div>
            <div>
              <label className="label text-xs">Description</label>
              <textarea rows={2} value={ach.description} onChange={(e) => updateItem(idx, 'description', e.target.value)} className="input text-sm resize-none" placeholder="Brief description of the achievement..." />
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-slate-400 text-center py-2">No achievements added yet</p>}
      </div>
    </EditorSection>
  );
};

export default AchievementsSection;
