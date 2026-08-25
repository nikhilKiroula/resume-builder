import { useEffect, useCallback, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Save, Eye, Edit2, Download, Share2, Copy,
  CheckCircle, Loader2, Settings, Sparkles, ChevronDown, ChevronUp,
  Globe, Lock, ExternalLink,
} from 'lucide-react';
import useResumeStore from '@/store/resumeStore';
import useEditorStore from '@/store/editorStore';
import { debounce, calculateCompletion, calculateATSScore, getPublicUrl, copyToClipboard } from '@/utils/helpers';
import toast from 'react-hot-toast';

// Section editors
import PersonalInfoSection from '@/features/editor/PersonalInfoSection';
import SummarySection from '@/features/editor/SummarySection';
import ExperienceSection from '@/features/editor/ExperienceSection';
import EducationSection from '@/features/editor/EducationSection';
import SkillsSection from '@/features/editor/SkillsSection';
import ProjectsSection from '@/features/editor/ProjectsSection';
import CertificationsSection from '@/features/editor/CertificationsSection';
import AchievementsSection from '@/features/editor/AchievementsSection';
import LanguagesSection from '@/features/editor/LanguagesSection';

// Preview & customization
import ResumePreview from '@/components/resume/ResumePreview';
import CustomizationPanel from '@/features/editor/CustomizationPanel';
import ATSPanel from '@/features/editor/ATSPanel';
import AIPanel from '@/features/editor/AIPanel';

// DnD
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';

// ─── Section Registry ──────────────────────────────────────────────────────────
const SECTION_COMPONENTS = {
  summary: { label: 'Summary', component: SummarySection },
  experience: { label: 'Experience', component: ExperienceSection },
  education: { label: 'Education', component: EducationSection },
  skills: { label: 'Skills', component: SkillsSection },
  projects: { label: 'Projects', component: ProjectsSection },
  certifications: { label: 'Certifications', component: CertificationsSection },
  achievements: { label: 'Achievements', component: AchievementsSection },
  languages: { label: 'Languages', component: LanguagesSection },
};

// ─── Sortable Section Wrapper ──────────────────────────────────────────────────
const SortableSectionItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-4 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 z-10"
        aria-label="Drag to reorder section"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      {children}
    </div>
  );
};

// ─── Editor Page ───────────────────────────────────────────────────────────────
const EditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { fetchResume, updateResume } = useResumeStore();
  const {
    resumeData, saveStatus, setSaveStatus, initEditor, updateResumeData, updateSection,
    mobileView, setMobileView, customizationOpen, setCustomizationOpen,
    aiPanelOpen, setAIPanelOpen, clearEditor,
  } = useEditorStore();

  const [isLoadingResume, setIsLoadingResume] = useState(true);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'ats' | 'ai'

  // Load resume on mount
  useEffect(() => {
    const load = async () => {
      setIsLoadingResume(true);
      const result = await fetchResume(id);
      if (result.success) {
        initEditor(result.resume);
      } else {
        toast.error('Resume not found');
        navigate('/dashboard');
      }
      setIsLoadingResume(false);
    };
    load();
    return () => clearEditor();
  }, [id]);

  // Debounced autosave — fires 800ms after last change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce(async (data) => {
      const result = await updateResume(data._id, data);
      if (result.success) {
        setSaveStatus('saved');
      } else {
        setSaveStatus('error');
        toast.error('Auto-save failed. Please try again.');
      }
    }, 800),
    [updateResume, setSaveStatus]
  );

  // Trigger autosave whenever resumeData changes
  useEffect(() => {
    if (!resumeData || saveStatus !== 'saving') return;
    debouncedSave(resumeData);
  }, [resumeData, saveStatus]);

  // Manual save
  const handleManualSave = async () => {
    if (!resumeData) return;
    setSaveStatus('saving');
    const result = await updateResume(resumeData._id, resumeData);
    setSaveStatus(result.success ? 'saved' : 'error');
    if (result.success) toast.success('Resume saved!');
    else toast.error('Failed to save resume');
  };

  // Print/PDF
  const handlePrint = () => window.print();

  // Share
  const handleTogglePublic = async () => {
    if (!resumeData) return;
    const { togglePublic } = useResumeStore.getState();
    const result = await togglePublic(resumeData._id);
    if (result.success) {
      updateResumeData({ isPublic: result.isPublic, publicSlug: result.publicSlug });
      toast.success(result.isPublic ? 'Resume is now public!' : 'Resume is now private');
    }
  };

  const handleCopyLink = async () => {
    if (!resumeData?.publicSlug) return;
    const url = getPublicUrl(resumeData.publicSlug);
    const copied = await copyToClipboard(url);
    if (copied) toast.success('Link copied to clipboard!');
    else toast.error('Failed to copy link');
  };

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Reorder sections
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const sections = resumeData?.sectionOrder || [];
    const oldIdx = sections.indexOf(active.id);
    const newIdx = sections.indexOf(over.id);
    const newOrder = arrayMove(sections, oldIdx, newIdx);
    updateResumeData({ sectionOrder: newOrder });
  };

  // Scores
  const completion = resumeData ? calculateCompletion(resumeData) : null;
  const ats = resumeData ? calculateATSScore(resumeData) : null;

  if (isLoadingResume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="xl" className="text-brand-600" />
          <p className="text-slate-500">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (!resumeData) return null;

  const sectionOrder = resumeData.sectionOrder || [];

  return (
    <div className="h-screen flex flex-col bg-slate-100 dark:bg-slate-950 overflow-hidden">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header className="no-print h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 px-4 flex-shrink-0 z-20">
        <Link to="/dashboard" className="btn-ghost btn-sm p-2 rounded-lg" title="Back to Dashboard">
          <ArrowLeft className="w-4 h-4" />
        </Link>

        {/* Resume title */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={resumeData.title}
            onChange={(e) => updateResumeData({ title: e.target.value })}
            className="text-sm font-semibold text-slate-900 dark:text-white bg-transparent border-none outline-none w-full truncate focus:bg-slate-100 dark:focus:bg-slate-800 rounded px-1 -ml-1"
            placeholder="Resume title"
          />
        </div>

        {/* Save status */}
        <div className="hidden sm:flex items-center gap-1 text-xs">
          {saveStatus === 'saving' && (
            <span className="text-slate-400 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Saving...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-emerald-500 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Saved
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="text-red-500 text-xs">Save failed</span>
          )}
        </div>

        {/* Completion */}
        {completion && (
          <div className="hidden md:flex items-center gap-2 text-xs">
            <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-brand-600 rounded-full transition-all" style={{ width: `${completion.overall}%` }} />
            </div>
            <span className="text-slate-500">{completion.overall}%</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button onClick={() => setActiveTab(activeTab === 'ats' ? 'editor' : 'ats')}
            className={`btn btn-sm rounded-lg hidden sm:flex ${activeTab === 'ats' ? 'btn-primary' : 'btn-secondary'}`}
            title="ATS Score">
            ATS {ats?.score}%
          </button>

          <button onClick={() => setAIPanelOpen(!aiPanelOpen)}
            className={`btn btn-sm rounded-lg hidden md:flex ${aiPanelOpen ? 'btn-primary' : 'btn-secondary'}`}
            title="AI Assistant">
            <Sparkles className="w-3.5 h-3.5" /> AI
          </button>

          <button onClick={() => setCustomizationOpen(!customizationOpen)}
            className={`btn btn-sm rounded-lg ${customizationOpen ? 'btn-primary' : 'btn-secondary'}`}
            title="Customization">
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Share */}
          <div className="relative">
            <button onClick={() => setShareMenuOpen(!shareMenuOpen)} className="btn btn-secondary btn-sm rounded-lg" title="Share">
              <Share2 className="w-3.5 h-3.5" />
            </button>
            {shareMenuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShareMenuOpen(false)} />
                <div className="absolute right-0 top-10 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-modal border border-slate-200 dark:border-slate-700 z-40 p-3 space-y-2 animate-scale-in">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Public Link</span>
                    <button onClick={handleTogglePublic}
                      className={`w-9 h-5 rounded-full transition-colors ${resumeData.isPublic ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${resumeData.isPublic ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                  {resumeData.isPublic && resumeData.publicSlug ? (
                    <div className="space-y-2">
                      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-2 text-xs text-slate-600 dark:text-slate-400 break-all">
                        {getPublicUrl(resumeData.publicSlug)}
                      </div>
                      <button onClick={handleCopyLink} className="btn btn-secondary btn-sm w-full">
                        <Copy className="w-3.5 h-3.5" /> Copy Link
                      </button>
                      <a href={`/resume/public/${resumeData.publicSlug}`} target="_blank" rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm w-full">
                        <ExternalLink className="w-3.5 h-3.5" /> Preview
                      </a>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Toggle on to generate a public link</p>
                  )}
                </div>
              </>
            )}
          </div>

          <button onClick={handlePrint} className="btn btn-secondary btn-sm rounded-lg" title="Download PDF">
            <Download className="w-3.5 h-3.5" />
          </button>

          <button onClick={handleManualSave} disabled={saveStatus === 'saving'} className="btn btn-primary btn-sm rounded-lg hidden sm:flex" title="Save">
            <Save className="w-3.5 h-3.5" /> Save
          </button>
        </div>
      </header>

      {/* ── Mobile tab switcher ───────────────────────────────────────── */}
      <div className="no-print lg:hidden flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
        {['edit', 'preview'].map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileView(tab)}
            className={`flex-1 py-3 text-sm font-medium capitalize flex items-center justify-center gap-2 transition-colors ${
              mobileView === tab
                ? 'text-brand-600 border-b-2 border-brand-600'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {tab === 'edit' ? <Edit2 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {tab === 'edit' ? 'Edit' : 'Preview'}
          </button>
        ))}
      </div>

      {/* ── Main editor area ─────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: Editor */}
        <div className={`flex flex-col ${mobileView === 'preview' ? 'hidden' : 'flex'} lg:flex w-full lg:w-[42%] xl:w-[40%] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto`}>

          {/* Sub-tabs: Editor | ATS | AI */}
          <div className="no-print hidden sm:flex border-b border-slate-200 dark:border-slate-800">
            {[
              { key: 'editor', label: 'Editor' },
              { key: 'ats', label: `ATS ${ats?.score || 0}%` },
              { key: 'ai', label: 'AI Assistant' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-2.5 text-xs font-medium transition-colors border-b-2 ${
                  activeTab === key
                    ? 'text-brand-600 border-brand-600'
                    : 'text-slate-500 border-transparent hover:text-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Editor content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'editor' && (
              <div className="p-4 space-y-2">
                {/* Personal Info always first */}
                <div className="pl-6">
                  <PersonalInfoSection />
                </div>

                {/* Draggable sections */}
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                    {sectionOrder.map((sectionKey) => {
                      const sectionDef = SECTION_COMPONENTS[sectionKey];
                      if (!sectionDef) return null;
                      const SectionComp = sectionDef.component;
                      return (
                        <SortableSectionItem key={sectionKey} id={sectionKey}>
                          <div className="pl-6">
                            <SectionComp />
                          </div>
                        </SortableSectionItem>
                      );
                    })}
                  </SortableContext>
                </DndContext>
              </div>
            )}

            {activeTab === 'ats' && <ATSPanel resume={resumeData} />}
            {activeTab === 'ai' && <AIPanel resume={resumeData} onUpdate={updateResumeData} />}
          </div>
        </div>

        {/* Customization panel (slides in on top of editor on mobile, sidebar on desktop) */}
        {customizationOpen && (
          <div className="no-print w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
            <CustomizationPanel />
          </div>
        )}

        {/* Right panel: Preview */}
        <div className={`${mobileView === 'edit' ? 'hidden' : 'flex'} lg:flex flex-1 flex-col bg-slate-200 dark:bg-slate-950 overflow-auto`}>
          <div className="flex-1 p-4 flex items-start justify-center">
            <div className="resume-preview-wrapper shadow-xl" style={{ width: '210mm', minWidth: '210mm' }}>
              <ResumePreview resume={resumeData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
