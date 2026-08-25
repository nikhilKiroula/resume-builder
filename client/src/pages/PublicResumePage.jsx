import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/services/api';
import { FileText, Globe, AlertTriangle } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';
// Import templates lazily
import ModernTemplate from '@/templates/ModernTemplate';
import ClassicTemplate from '@/templates/ClassicTemplate';
import MinimalTemplate from '@/templates/MinimalTemplate';
import ProfessionalTemplate from '@/templates/ProfessionalTemplate';
import CreativeTemplate from '@/templates/CreativeTemplate';
import ATSTemplate from '@/templates/ATSTemplate';

const templateMap = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  professional: ProfessionalTemplate,
  creative: CreativeTemplate,
  ats: ATSTemplate,
};

const PublicResumePage = () => {
  const { slug } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicResume = async () => {
      try {
        const res = await api.get(`/resumes/public/${slug}`);
        setResume(res.data.resume);
      } catch (err) {
        setError(err.response?.data?.message || 'Resume not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPublicResume();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="xl" className="text-brand-600" />
          <p className="text-slate-500">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-5">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Resume Not Found</h1>
        <p className="text-slate-500 mb-6">{error}</p>
        <Link to="/" className="btn btn-primary btn-md">Go to Resumely</Link>
      </div>
    );
  }

  const TemplateComponent = templateMap[resume?.selectedTemplate] || ModernTemplate;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Top bar */}
      <div className="no-print sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white">Resumely</span>
        </Link>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Globe className="w-4 h-4" />
          Public Resume
        </div>
        <button
          onClick={() => window.print()}
          className="btn btn-primary btn-sm"
        >
          Download PDF
        </button>
      </div>

      {/* Resume preview */}
      <div className="py-8 px-4 flex justify-center">
        <div className="resume-preview-wrapper w-full max-w-[210mm]">
          <TemplateComponent resume={resume} />
        </div>
      </div>
    </div>
  );
};

export default PublicResumePage;
