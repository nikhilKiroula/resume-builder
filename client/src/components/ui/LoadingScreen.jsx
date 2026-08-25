import { FileText } from 'lucide-react';

const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center shadow-glow">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <div className="absolute inset-0 rounded-2xl bg-brand-600 animate-ping opacity-20" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-xl font-bold text-slate-900 dark:text-white">Resumely</span>
        <span className="text-sm text-slate-500">Loading your workspace...</span>
      </div>
    </div>
  </div>
);

export default LoadingScreen;
