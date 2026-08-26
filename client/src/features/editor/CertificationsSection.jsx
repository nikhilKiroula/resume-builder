import { Award, Plus, Trash2 } from 'lucide-react';
import useEditorStore from '@/store/editorStore';
import EditorSection from './EditorSection';

const EMPTY = { name: '', issuer: '', date: '', credentialUrl: '' };

const CertificationsSection = () => {
  const { resumeData, updateSection } = useEditorStore();
  const items = resumeData?.certifications || [];
  const setItems = (v) => updateSection('certifications', v);
  // tempKey used only as React key — never sent to DB as _id
  const addItem = () => setItems([...items, { ...EMPTY, tempKey: `temp_${Date.now()}_${Math.random().toString(36).slice(2)}` }]);
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx, field, val) => setItems(items.map((item, i) => i === idx ? { ...item, [field]: val } : item));

  return (
    <EditorSection title="Certifications" icon={Award} badge={items.length || undefined}>
      <div className="space-y-3">
        <button onClick={addItem} className="btn btn-secondary btn-sm w-full"><Plus className="w-3.5 h-3.5" /> Add Certification</button>
        {items.map((cert, idx) => (
          <div key={cert._id || cert.tempKey || idx} className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 bg-white dark:bg-slate-900 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{cert.name || 'New Certification'}</span>
              <button onClick={() => removeItem(idx)} className="btn-ghost p-1 rounded text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label text-xs">Certification Name</label>
                <input type="text" value={cert.name} onChange={(e) => updateItem(idx, 'name', e.target.value)} className="input text-sm" placeholder="AWS Certified" />
              </div>
              <div>
                <label className="label text-xs">Issuing Organization</label>
                <input type="text" value={cert.issuer} onChange={(e) => updateItem(idx, 'issuer', e.target.value)} className="input text-sm" placeholder="Amazon" />
              </div>
              <div>
                <label className="label text-xs">Date</label>
                <input type="month" value={cert.date} onChange={(e) => updateItem(idx, 'date', e.target.value)} className="input text-sm" />
              </div>
              <div>
                <label className="label text-xs">Credential URL</label>
                <input type="url" value={cert.credentialUrl} onChange={(e) => updateItem(idx, 'credentialUrl', e.target.value)} className="input text-sm" placeholder="https://" />
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-slate-400 text-center py-2">No certifications added yet</p>}
      </div>
    </EditorSection>
  );
};

export default CertificationsSection;
