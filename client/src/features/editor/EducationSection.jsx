import { useState } from 'react';
import { GraduationCap, Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import useEditorStore from '@/store/editorStore';
import EditorSection from './EditorSection';
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const EMPTY = { institution: '', degree: '', field: '', startDate: '', endDate: '', grade: '', description: '' };

const SortableItem = ({ id, edu, idx, onUpdate, onRemove }) => {
  const [expanded, setExpanded] = useState(idx === 0);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const update = (field, val) => onUpdate(idx, { ...edu, [field]: val });

  return (
    <div ref={setNodeRef} style={style} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 dark:bg-slate-800">
        <div {...attributes} {...listeners} className="cursor-grab text-slate-300 hover:text-slate-500">
          <GripVertical className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
            {edu.degree || 'New Degree'} {edu.institution && `· ${edu.institution}`}
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
            <div className="col-span-2">
              <label className="label">Institution *</label>
              <input type="text" value={edu.institution} onChange={(e) => update('institution', e.target.value)} className="input text-sm" placeholder="University of Example" />
            </div>
            <div>
              <label className="label">Degree</label>
              <input type="text" value={edu.degree} onChange={(e) => update('degree', e.target.value)} className="input text-sm" placeholder="Bachelor of Science" />
            </div>
            <div>
              <label className="label">Field of Study</label>
              <input type="text" value={edu.field} onChange={(e) => update('field', e.target.value)} className="input text-sm" placeholder="Computer Science" />
            </div>
            <div>
              <label className="label">Start Date</label>
              <input type="month" value={edu.startDate} onChange={(e) => update('startDate', e.target.value)} className="input text-sm" />
            </div>
            <div>
              <label className="label">End Date</label>
              <input type="month" value={edu.endDate} onChange={(e) => update('endDate', e.target.value)} className="input text-sm" />
            </div>
            <div>
              <label className="label">Grade / GPA</label>
              <input type="text" value={edu.grade} onChange={(e) => update('grade', e.target.value)} className="input text-sm" placeholder="3.8 / 4.0" />
            </div>
          </div>
          <div>
            <label className="label">Additional Notes</label>
            <textarea rows={2} value={edu.description} onChange={(e) => update('description', e.target.value)} className="input text-sm resize-none" placeholder="Honors, relevant coursework, thesis..." />
          </div>
        </div>
      )}
    </div>
  );
};

const EducationSection = () => {
  const { resumeData, updateSection } = useEditorStore();
  const items = resumeData?.education || [];
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const setItems = (v) => updateSection('education', v);
  const addItem = () => setItems([{ ...EMPTY, _id: Date.now().toString() }, ...items]);
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx, updated) => setItems(items.map((item, i) => (i === idx ? updated : item)));
  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oi = items.findIndex((e) => (e._id || e.institution) === active.id);
    const ni = items.findIndex((e) => (e._id || e.institution) === over.id);
    setItems(arrayMove(items, oi, ni));
  };
  const ids = items.map((e, i) => e._id || `edu-${i}`);

  return (
    <EditorSection title="Education" icon={GraduationCap} badge={items.length || undefined}>
      <div className="space-y-2">
        <button onClick={addItem} className="btn btn-secondary btn-sm w-full"><Plus className="w-3.5 h-3.5" /> Add Education</button>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            {items.map((edu, idx) => (
              <SortableItem key={edu._id || `edu-${idx}`} id={edu._id || `edu-${idx}`} edu={edu} idx={idx} onUpdate={updateItem} onRemove={removeItem} />
            ))}
          </SortableContext>
        </DndContext>
        {items.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No education added yet</p>}
      </div>
    </EditorSection>
  );
};

export default EducationSection;
