import { useState } from 'react';
import { FolderOpen, Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import useEditorStore from '@/store/editorStore';
import EditorSection from './EditorSection';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const EMPTY = { title: '', description: '', technologies: [], liveUrl: '', githubUrl: '', startDate: '', endDate: '' };

const SortableItem = ({ id, proj, idx, onUpdate, onRemove }) => {
  const [expanded, setExpanded] = useState(idx === 0);
  const [newTech, setNewTech] = useState('');
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const update = (field, val) => onUpdate(idx, { ...proj, [field]: val });

  const addTech = () => {
    if (!newTech.trim()) return;
    update('technologies', [...(proj.technologies || []), newTech.trim()]);
    setNewTech('');
  };
  const removeTech = (i) => update('technologies', proj.technologies.filter((_, ti) => ti !== i));

  return (
    <div ref={setNodeRef} style={style} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 dark:bg-slate-800">
        <div {...attributes} {...listeners} className="cursor-grab text-slate-300 hover:text-slate-500"><GripVertical className="w-4 h-4" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{proj.title || 'New Project'}</p>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="btn-ghost p-1 rounded">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <button onClick={() => onRemove(idx)} className="btn-ghost p-1 rounded text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
      {expanded && (
        <div className="p-3 space-y-3 bg-white dark:bg-slate-900">
          <div>
            <label className="label">Project Title *</label>
            <input type="text" value={proj.title} onChange={(e) => update('title', e.target.value)} className="input text-sm" placeholder="My Awesome Project" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea rows={3} value={proj.description} onChange={(e) => update('description', e.target.value)} className="input text-sm resize-none" placeholder="What does this project do? What problem does it solve?" />
          </div>
          <div>
            <label className="label">Technologies</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {proj.technologies?.map((tech, i) => (
                <span key={i} className="badge badge-blue text-xs cursor-pointer" onClick={() => removeTech(i)}>
                  {tech} ×
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newTech} onChange={(e) => setNewTech(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }} placeholder="Add technology (Enter)" className="input text-sm flex-1" />
              <button onClick={addTech} className="btn btn-secondary btn-sm rounded-lg"><Plus className="w-3.5 h-3.5" /></button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Live URL</label>
              <input type="url" value={proj.liveUrl} onChange={(e) => update('liveUrl', e.target.value)} className="input text-sm" placeholder="https://" />
            </div>
            <div>
              <label className="label">GitHub URL</label>
              <input type="url" value={proj.githubUrl} onChange={(e) => update('githubUrl', e.target.value)} className="input text-sm" placeholder="https://github.com/..." />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProjectsSection = () => {
  const { resumeData, updateSection } = useEditorStore();
  const items = resumeData?.projects || [];
  const sensors = useSensors(useSensor(PointerSensor));
  const setItems = (v) => updateSection('projects', v);
  // tempKey used only as React/DnD key — never sent to DB as _id
  const addItem = () => setItems([{ ...EMPTY, tempKey: `temp_${Date.now()}_${Math.random().toString(36).slice(2)}` }, ...items]);
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx, updated) => setItems(items.map((item, i) => (i === idx ? updated : item)));
  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oi = items.findIndex((e) => (e._id || e.tempKey || e.title) === active.id);
    const ni = items.findIndex((e) => (e._id || e.tempKey || e.title) === over.id);
    setItems(arrayMove(items, oi, ni));
  };
  const ids = items.map((e, i) => e._id || e.tempKey || `proj-${i}`);

  return (
    <EditorSection title="Projects" icon={FolderOpen} badge={items.length || undefined}>
      <div className="space-y-2">
        <button onClick={addItem} className="btn btn-secondary btn-sm w-full"><Plus className="w-3.5 h-3.5" /> Add Project</button>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            {items.map((proj, idx) => (
              <SortableItem key={proj._id || proj.tempKey || `proj-${idx}`} id={proj._id || proj.tempKey || `proj-${idx}`} proj={proj} idx={idx} onUpdate={updateItem} onRemove={removeItem} />
            ))}
          </SortableContext>
        </DndContext>
        {items.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No projects added yet</p>}
      </div>
    </EditorSection>
  );
};

export default ProjectsSection;
