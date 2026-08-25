import { useState } from 'react';
import { Zap, Plus, Trash2 } from 'lucide-react';
import useEditorStore from '@/store/editorStore';
import EditorSection from './EditorSection';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const EMPTY = { name: '', level: 'Intermediate', category: '' };

const SkillsSection = () => {
  const { resumeData, updateSection } = useEditorStore();
  const items = resumeData?.skills || [];
  const [newSkill, setNewSkill] = useState('');
  const [newLevel, setNewLevel] = useState('Intermediate');

  const setItems = (v) => updateSection('skills', v);
  const addSkill = () => {
    if (!newSkill.trim()) return;
    setItems([...items, { name: newSkill.trim(), level: newLevel, category: '', _id: Date.now().toString() }]);
    setNewSkill('');
  };
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx, field, val) => setItems(items.map((item, i) => i === idx ? { ...item, [field]: val } : item));

  return (
    <EditorSection title="Skills" icon={Zap} badge={items.length || undefined}>
      <div className="space-y-3">
        {/* Quick add */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
            placeholder="Add skill (Enter)"
            className="input text-sm flex-1"
          />
          <select value={newLevel} onChange={(e) => setNewLevel(e.target.value)} className="input text-sm w-32">
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <button onClick={addSkill} className="btn btn-secondary btn-sm rounded-lg">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Skills list */}
        <div className="space-y-1.5 max-h-72 overflow-y-auto">
          {items.map((skill, idx) => (
            <div key={skill._id || idx} className="flex items-center gap-2">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => updateItem(idx, 'name', e.target.value)}
                className="input text-sm flex-1"
                placeholder="Skill name"
              />
              <select
                value={skill.level}
                onChange={(e) => updateItem(idx, 'level', e.target.value)}
                className="input text-sm w-32"
              >
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <button onClick={() => removeItem(idx)} className="btn-ghost p-1.5 rounded text-slate-400 hover:text-red-500">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-2">Add your skills above</p>
        )}
      </div>
    </EditorSection>
  );
};

export default SkillsSection;
