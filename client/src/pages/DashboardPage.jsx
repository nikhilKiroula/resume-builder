import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, Search, Filter, Grid, List, FileText,
  Clock, MoreVertical, Edit, Copy, Trash2, Eye,
  Download, Share2, TrendingUp,
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import useResumeStore from '@/store/resumeStore';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { timeAgo, calculateCompletion, calculateATSScore } from '@/utils/helpers';
import toast from 'react-hot-toast';

// ─── Skeleton ──────────────────────────────────────────────────────────────────
const ResumeSkeleton = () => (
  <div className="card p-5 animate-pulse">
    <div className="skeleton h-32 rounded-lg mb-4" />
    <div className="skeleton h-4 w-3/4 rounded mb-2" />
    <div className="skeleton h-3 w-1/2 rounded mb-4" />
    <div className="skeleton h-2 rounded-full mb-1" />
    <div className="flex gap-2 mt-4">
      <div className="skeleton h-8 w-20 rounded-lg" />
      <div className="skeleton h-8 w-20 rounded-lg" />
    </div>
  </div>
);

// ─── Resume Card ───────────────────────────────────────────────────────────────
const ResumeCard = ({ resume, onDelete, onDuplicate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const completion = calculateCompletion(resume);
  const ats = calculateATSScore(resume);

  const templateColors = {
    modern: 'from-blue-500 to-indigo-600',
    classic: 'from-slate-600 to-slate-800',
    minimal: 'from-emerald-500 to-teal-600',
    professional: 'from-violet-500 to-purple-600',
    creative: 'from-orange-500 to-rose-600',
    ats: 'from-sky-500 to-cyan-600',
  };

  const gradientClass = templateColors[resume.selectedTemplate] || templateColors.modern;

  return (
    <div className="card-hover overflow-hidden group relative">
      {/* Template preview */}
      <div className={`h-36 bg-gradient-to-br ${gradientClass} relative`}>
        <div className="absolute inset-3 flex gap-2">
          <div className="w-1/3 space-y-1.5">
            <div className="h-8 w-8 rounded-full bg-white/30" />
            <div className="h-1.5 bg-white/40 rounded w-full" />
            <div className="h-1.5 bg-white/25 rounded w-3/4" />
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="h-1.5 bg-white/40 rounded w-3/4" />
            <div className="h-1 bg-white/25 rounded" />
            <div className="h-1 bg-white/20 rounded w-5/6" />
            <div className="h-1.5 bg-white/30 rounded w-1/2 mt-2" />
            <div className="h-1 bg-white/20 rounded" />
          </div>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
          <Link
            to={`/editor/${resume._id}`}
            className="btn bg-white text-slate-900 btn-sm rounded-lg shadow"
          >
            <Edit className="w-3.5 h-3.5" /> Edit
          </Link>
        </div>

        {/* Public badge */}
        {resume.isPublic && (
          <div className="absolute top-2 right-2 badge badge-green text-xs">
            <Share2 className="w-3 h-3" /> Public
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-white truncate">{resume.title}</h3>
            {resume.personalInfo?.jobTitle && (
              <p className="text-xs text-slate-500 truncate">{resume.personalInfo.jobTitle}</p>
            )}
          </div>
          {/* Actions menu */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="btn-ghost p-1.5 rounded-md"
              aria-label="Resume actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-modal border border-slate-200 dark:border-slate-700 z-20 py-1 animate-scale-in">
                  <Link to={`/editor/${resume._id}`} className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                    onClick={() => setMenuOpen(false)}>
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </Link>
                  <button onClick={() => { onDuplicate(resume._id); setMenuOpen(false); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300">
                    <Copy className="w-3.5 h-3.5" /> Duplicate
                  </button>
                  {resume.isPublic && resume.publicSlug && (
                    <a href={`/resume/public/${resume.publicSlug}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                      onClick={() => setMenuOpen(false)}>
                      <Eye className="w-3.5 h-3.5" /> View Public
                    </a>
                  )}
                  <div className="divider my-1" />
                  <button onClick={() => { onDelete(resume._id); setMenuOpen(false); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Completion bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Completion</span>
            <span>{completion.overall}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-500"
              style={{ width: `${completion.overall}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo(resume.updatedAt)}
          </div>
          <div className="flex items-center gap-1">
            <span className={`badge text-xs ${ats.score >= 70 ? 'badge-green' : ats.score >= 40 ? 'badge-yellow' : 'badge-red'}`}>
              ATS {ats.score}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Dashboard Page ────────────────────────────────────────────────────────────
const DashboardPage = () => {
  const { user } = useAuthStore();
  const { resumes, isLoading, fetchResumes, createResume, isCreating, deleteResume, duplicateResume } = useResumeStore();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('updatedAt');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const filtered = resumes.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.title?.toLowerCase().includes(q) ||
      r.personalInfo?.fullName?.toLowerCase().includes(q) ||
      r.personalInfo?.jobTitle?.toLowerCase().includes(q)
    );
  });

  const handleCreate = async () => {
    const result = await createResume({ title: 'My Resume' });
    if (result.success) {
      toast.success('Resume created!');
      navigate(`/editor/${result.resume._id}`);
    } else {
      toast.error(result.message || 'Failed to create resume');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteResume(deleteId);
    setDeleteId(null);
  };

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="max-w-7xl mx-auto pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            You have {resumes.length} resume{resumes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="btn btn-primary btn-md flex-shrink-0"
          id="create-resume-btn"
        >
          <Plus className="w-4 h-4" />
          {isCreating ? 'Creating...' : 'New Resume'}
        </button>
      </div>

      {/* Stats row */}
      {resumes.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Resumes', value: resumes.length, icon: FileText, color: 'text-brand-600' },
            {
              label: 'Avg Completion',
              value: `${Math.round(resumes.reduce((a, r) => a + calculateCompletion(r).overall, 0) / resumes.length)}%`,
              icon: TrendingUp,
              color: 'text-emerald-600',
            },
            {
              label: 'Public Resumes',
              value: resumes.filter((r) => r.isPublic).length,
              icon: Share2,
              color: 'text-blue-600',
            },
            {
              label: 'Last Updated',
              value: resumes.length ? timeAgo(resumes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0]?.updatedAt) : '—',
              icon: Clock,
              color: 'text-amber-600',
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-4">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="font-bold text-slate-900 dark:text-white">{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search + sort */}
      {resumes.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search resumes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
              id="resume-search"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input w-full sm:w-48"
            id="resume-sort"
          >
            <option value="updatedAt">Last Modified</option>
            <option value="createdAt">Date Created</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      )}

      {/* Resume grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => <ResumeSkeleton key={i} />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((resume) => (
            <ResumeCard
              key={resume._id}
              resume={resume}
              onDelete={(id) => setDeleteId(id)}
              onDuplicate={duplicateResume}
            />
          ))}
        </div>
      ) : resumes.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mb-6">
            <FileText className="w-10 h-10 text-brand-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            No resumes yet
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
            Create your first resume and start your journey to landing your dream job.
          </p>
          <button onClick={handleCreate} disabled={isCreating} className="btn btn-primary btn-lg">
            <Plus className="w-5 h-5" />
            Create My First Resume
          </button>
        </div>
      ) : (
        /* No search results */
        <div className="text-center py-16">
          <Search className="w-10 h-10 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No resumes match "{search}"</p>
          <button onClick={() => setSearch('')} className="text-brand-600 text-sm mt-2 hover:underline">
            Clear search
          </button>
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Resume"
        message="Are you sure you want to delete this resume? This action cannot be undone."
        confirmLabel="Delete Resume"
        isLoading={useResumeStore.getState().isDeleting === deleteId}
      />
    </div>
  );
};

export default DashboardPage;
