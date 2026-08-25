import { calculateATSScore, calculateCompletion } from '@/utils/helpers';
import { CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react';

const ATSPanel = ({ resume }) => {
  const ats = calculateATSScore(resume);
  const completion = calculateCompletion(resume);

  const gradeColor = {
    Excellent: 'text-emerald-600',
    Good: 'text-blue-600',
    Fair: 'text-amber-600',
    'Needs Work': 'text-red-600',
  }[ats.grade] || 'text-slate-600';

  const scoreColor = ats.score >= 80 ? 'text-emerald-600' : ats.score >= 60 ? 'text-blue-600' : ats.score >= 40 ? 'text-amber-600' : 'text-red-600';
  const trackColor = ats.score >= 80 ? 'bg-emerald-500' : ats.score >= 60 ? 'bg-blue-500' : ats.score >= 40 ? 'bg-amber-500' : 'bg-red-500';

  const completionSections = Object.entries(completion.sections || {});

  return (
    <div className="p-4 space-y-6">
      {/* ATS Score */}
      <div className="text-center">
        <div className={`text-5xl font-extrabold ${scoreColor}`}>{ats.score}</div>
        <div className="text-slate-400 text-sm mb-2">ATS Score</div>
        <div className={`inline-block badge text-sm font-semibold ${gradeColor}`}>
          {ats.grade}
        </div>
      </div>

      {/* Score bar */}
      <div>
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full ${trackColor} rounded-full transition-all duration-700`} style={{ width: `${ats.score}%` }} />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>0</span><span>50</span><span>100</span>
        </div>
      </div>

      {/* Completion by section */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-brand-600" /> Resume Completion
        </h3>
        <div className="space-y-2">
          {completionSections.map(([section, score]) => (
            <div key={section}>
              <div className="flex justify-between text-xs mb-1">
                <span className="capitalize text-slate-600 dark:text-slate-400">{section === 'personalInfo' ? 'Personal Info' : section}</span>
                <span className={score >= 100 ? 'text-emerald-600' : score > 0 ? 'text-amber-600' : 'text-red-400'}>{score}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${score >= 100 ? 'bg-emerald-500' : score > 0 ? 'bg-amber-400' : 'bg-red-300'}`}
                  style={{ width: `${score}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-center text-sm font-semibold text-brand-600">
          Overall: {completion.overall}%
        </div>
      </div>

      {/* Suggestions */}
      {ats.suggestions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" /> Suggestions
          </h3>
          <div className="space-y-2">
            {ats.suggestions.map((s, i) => (
              <div key={i} className="flex gap-2 items-start p-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 dark:text-amber-200">{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {ats.suggestions.length === 0 && (
        <div className="flex gap-2 items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <p className="text-xs text-emerald-800 dark:text-emerald-200">Great job! Your resume is well-optimized.</p>
        </div>
      )}

      <p className="text-xs text-slate-400 text-center">
        This score is an estimate based on resume completeness and formatting best practices. Actual ATS results may vary by employer.
      </p>
    </div>
  );
};

export default ATSPanel;
