import { Link } from 'react-router-dom';
import { FileText, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-center px-4">
    <div className="w-20 h-20 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mb-6">
      <FileText className="w-10 h-10 text-brand-500" />
    </div>
    <h1 className="text-6xl font-extrabold text-brand-600 mb-4">404</h1>
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Page Not Found</h2>
    <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <div className="flex flex-col sm:flex-row gap-3">
      <button onClick={() => window.history.back()} className="btn btn-secondary btn-md">
        <ArrowLeft className="w-4 h-4" /> Go Back
      </button>
      <Link to="/" className="btn btn-primary btn-md">
        <Home className="w-4 h-4" /> Home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
