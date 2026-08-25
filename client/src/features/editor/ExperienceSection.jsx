import { useState } from 'react';
import { Briefcase, Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import useEditorStore from '@/store/editorStore';
import EditorSection from './EditorSection';
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const EMPTY_ITEM = {
  company: '', position: '', location: '', startDate: '', endDate: '',
  currentlyWorking: false, description: '', bulletPoints: [],
};

const BulletEditor = ({ bullets = [], onChange }) => {
  const [newBullet, setNewBullet] = useState('');

  const addBullet = () => {
    if (!newBullet.trim()) return;
    onChange([...bullets, newBullet.trim()]);
    setNewBullet('');
  };

  const removeBullet = (i) => onChange(bullets.filter((_, idx) => idx !== i));
  const updateBullet = (i, val) => onChange(bullets.map((b, idx) => (idx === i ? val : b)));

  return (
    <div className="space-y-2">
      <label className="label">Bullet Points</label>
      {bullets.map((bp, i) => (
        <div key={i} className="flex gap-2 items-start">
          <span className="text-slate-400 mt-2 text-xs">•</span>
          <input
            type="text"
            value={bp}
            onChange={(e) => updateBullet(i, e.target.value)}
            className="input text-sm flex-1"
            placeholder="Describe an achievement..."
          />
          <button onClick={() => removeBullet(i)} className="btn-ghost p-1.5 rounded text-slate-400 hover:text-red-500 mt-1">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <input
          type="text"
          value={newBullet}
          onChange={(e) => setNewBullet(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addBullet(); } }}
          placeholder="Add bullet point (Enter to add)"
          className="input text-sm flex-1"
        />
        <button onClick={addBullet} className="btn btn-secondary btn-sm rounded-lg">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

const SortableItem = ({ id, exp, idx, onUpdate, onRemove }) => {
  const [expanded, setExpanded] = useState(idx === 0);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  const update = (field, val) => onUpdate(idx, { ...exp, [field]: val });

  return (
    <div ref={setNodeRef} style={style} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 dark:bg-slate-800">
        <div {...attributes} {...listeners} className="cursor-grab text-slate-300 hover:text-slate-500">
          <GripVertical className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
            {exp.position || 'New Position'} {exp.company && `@ ${exp.company}`}
          </p>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="btn-ghost p-1 rounded">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <button onClick={() => onRemove(idx)} className="btn-ghost p-1 rounded text-slate-400 hover:text-red-500">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {expanded && (
        <div className="p-3 space-y-3 bg-white dark:bg-slate-900">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Job Title *</label>
              <input type="text" value={exp.position} onChange={(e) => update('position', e.target.value)} className="input text-sm" placeholder="Software Engineer" />
            </div>
            <div>
              <label className="label">Company *</label>
              <input type="text" value={exp.company} onChange={(e) => update('company', e.target.value)} className="input text-sm" placeholder="Acme Corp" />
            </div>
            <div>
              <label className="label">Location</label>
              <input type="text" value={exp.location} onChange={(e) => update('location', e.target.value)} className="input text-sm" placeholder="New York, NY" />
            </div>
            <div>
              <label className="label">Start Date</label>
              <input type="month" value={exp.startDate} onChange={(e) => update('startDate', e.target.value)} className="input text-sm" />
            </div>
            <div>
              <label className="label">End Date</label>
              <input type="month" value={exp.endDate} onChange={(e) => update('endDate', e.target.value)} className="input text-sm" disabled={exp.currentlyWorking} />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                <input type="checkbox" checked={exp.currentlyWorking} onChange={(e) => update('currentlyWorking', e.target.checked)} className="w-4 h-4 rounded" />
                Currently working here
              </label>
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea rows={3} value={exp.description} onChange={(e) => update('description', e.target.value)} className="input text-sm resize-none" placeholder="Brief overview of your role and responsibilities..." />
          </div>
          <BulletEditor bullets={exp.bulletPoints} onChange={(bp) => update('bulletPoints', bp)} />
        </div>
      )}
    </div>
  );
};

const ExperienceSection = () => {
  const { resumeData, updateSection } = useEditorStore();
  const items = resumeData?.experience || [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const setItems = (newItems) => updateSection('experience', newItems);
  const addItem = () => setItems([{ ...EMPTY_ITEM, _id: Date.now().toString() }, ...items]);
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx, updated) => setItems(items.map((item, i) => (i === idx ? updated : item)));

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIdx = items.findIndex((e) => (e._id || e.company + e.position) === active.id);
    const newIdx = items.findIndex((e) => (e._id || e.company + e.position) === over.id);
    setItems(arrayMove(items, oldIdx, newIdx));
  };

  const itemIds = items.map((e, i) => e._id || `exp-${i}`);

  return (
    <EditorSection title="Experience" icon={Briefcase} badge={items.length || undefined}>
      <div className="space-y-2">
        <button onClick={addItem} className="btn btn-secondary btn-sm w-full">
          <Plus className="w-3.5 h-3.5" /> Add Experience
        </button>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
            {items.map((exp, idx) => (
              <SortableItem
                key={exp._id || `exp-${idx}`}
                id={exp._id || `exp-${idx}`}
                exp={exp}
                idx={idx}
                onUpdate={updateItem}
                onRemove={removeItem}
              />
            ))}
          </SortableContext>
        </DndContext>
        {items.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-4">No experience added yet</p>
        )}
      </div>
    </EditorSection>
  );
};

export default ExperienceSection;
