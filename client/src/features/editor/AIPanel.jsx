import { useState } from 'react';
import { Sparkles, Loader2, Copy, Check, AlertTriangle, Info } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

const AIPanel = ({ resume, onUpdate }) => {
  const [aiEnabled, setAiEnabled] = useState(null); // null = unknown, true/false
  const [loading, setLoading] = useState({});
  const [result, setResult] = useState({});
  const [copied, setCopied] = useState({});

  // Check AI status on first open
  useState(() => {
    api.get('/ai/status').then((res) => setAiEnabled(res.data.enabled)).catch(() => setAiEnabled(false));
  });

  const setLoad = (key, val) => setLoading((p) => ({ ...p, [key]: val }));
  const setRes = (key, val) => setResult((p) => ({ ...p, [key]: val }));

  const copyResult = async (key, text) => {
    await navigator.clipboard.writeText(text);
    setCopied((p) => ({ ...p, [key]: true }));
    setTimeout(() => setCopied((p) => ({ ...p, [key]: false })), 2000);
  };

  // Generate professional summary
  const generateSummary = async () => {
    setLoad('summary', true);
    try {
      const res = await api.post('/ai/summary', {
        jobTitle: resume?.personalInfo?.jobTitle,
        skills: resume?.skills?.map((s) => s.name),
        existingSummary: resume?.personalInfo?.summary,
        yearsOfExperience: resume?.experience?.length > 0 ? `${resume.experience.length}+ roles` : undefined,
      });
      if (res.data.success) {
        setRes('summary', res.data.summary);
      } else {
        toast.error(res.data.message || 'Failed to generate summary');
      }
    } catch (err) {
      toast.error('AI request failed');
    }
    setLoad('summary', false);
  };

  const applySummary = () => {
    if (!result.summary) return;
    onUpdate({ personalInfo: { ...resume?.personalInfo, summary: result.summary } });
    toast.success('Summary applied!');
    setRes('summary', null);
  };

  // Suggest skills
  const suggestSkills = async () => {
    setLoad('skills', true);
    try {
      const res = await api.post('/ai/suggestions', {
        jobTitle: resume?.personalInfo?.jobTitle,
        existingSkills: resume?.skills,
        experience: resume?.experience?.slice(0, 3),
      });
      if (res.data.success) {
        setRes('skills', res.data.suggestions);
      } else {
        toast.error(res.data.message || 'Failed to suggest skills');
      }
    } catch (err) {
      toast.error('AI request failed');
    }
    setLoad('skills', false);
  };

  const addSuggestedSkill = (skillName) => {
    const existingNames = resume?.skills?.map((s) => s.name.toLowerCase()) || [];
    if (existingNames.includes(skillName.toLowerCase())) {
      toast('Skill already added');
      return;
    }
    const newSkills = [...(resume?.skills || []), { name: skillName, level: 'Intermediate', category: '' }];
    onUpdate({ skills: newSkills });
    toast.success(`${skillName} added!`);
  };

  // Analyze resume
  const analyzeResume = async () => {
    setLoad('analyze', true);
    try {
      const res = await api.post('/ai/improve', {
        personalInfo: resume?.personalInfo,
        experience: resume?.experience,
        education: resume?.education,
        skills: resume?.skills,
        projects: resume?.projects,
      });
      if (res.data.success) {
        setRes('analyze', res.data.feedback);
      } else {
        toast.error(res.data.message || 'Analysis failed');
      }
    } catch (err) {
      toast.error('AI request failed');
    }
    setLoad('analyze', false);
  };

  if (aiEnabled === false) {
    return (
      <div className="p-6 flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-amber-500" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">AI Features Disabled</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            AI features are not configured. To enable them, add your <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">AI_API_KEY</code> to the server <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">.env</code> file and restart the server.
          </p>
        </div>
        <div className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-left w-full font-mono">
          AI_API_KEY=sk-your-openai-key-here
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-5">
      <div className="flex items-center gap-2 text-brand-600">
        <Sparkles className="w-4 h-4" />
        <h3 className="text-sm font-semibold">AI Resume Assistant</h3>
      </div>

      <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800 dark:text-blue-200">
          AI suggestions are based on your existing resume data. AI will not invent qualifications or experience you haven't provided.
        </p>
      </div>

      {/* Generate summary */}
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Professional Summary</h4>
        <p className="text-xs text-slate-500">Generate a compelling summary based on your job title and skills.</p>
        <button onClick={generateSummary} disabled={loading.summary} className="btn btn-primary btn-sm w-full">
          {loading.summary ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</> : <><Sparkles className="w-3.5 h-3.5" /> Generate Summary</>}
        </button>
        {result.summary && (
          <div className="space-y-2">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {result.summary}
            </div>
            <div className="flex gap-2">
              <button onClick={applySummary} className="btn btn-primary btn-sm flex-1">Apply to Resume</button>
              <button onClick={() => copyResult('summary', result.summary)} className="btn btn-secondary btn-sm">
                {copied.summary ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Skill suggestions */}
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Skill Suggestions</h4>
        <p className="text-xs text-slate-500">Get skill suggestions based on your job title and experience.</p>
        <button onClick={suggestSkills} disabled={loading.skills} className="btn btn-primary btn-sm w-full">
          {loading.skills ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Suggesting...</> : <><Sparkles className="w-3.5 h-3.5" /> Suggest Skills</>}
        </button>
        {result.skills && result.skills.length > 0 && (
          <div>
            <p className="text-xs text-slate-500 mb-2">Click to add to your resume:</p>
            <div className="flex flex-wrap gap-2">
              {result.skills.map((skill, i) => (
                <button key={i} onClick={() => addSuggestedSkill(skill)}
                  className="badge badge-blue text-xs cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Analyze resume */}
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Resume Analysis</h4>
        <p className="text-xs text-slate-500">Get AI feedback on your resume's strengths and areas to improve.</p>
        <button onClick={analyzeResume} disabled={loading.analyze} className="btn btn-primary btn-sm w-full">
          {loading.analyze ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing...</> : <><Sparkles className="w-3.5 h-3.5" /> Analyze Resume</>}
        </button>
        {result.analyze && (
          <div className="space-y-3">
            {result.analyze.strengths?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-emerald-600 mb-1">✓ Strengths</p>
                <ul className="space-y-1">
                  {result.analyze.strengths.map((s, i) => <li key={i} className="text-xs text-slate-600 dark:text-slate-400">• {s}</li>)}
                </ul>
              </div>
            )}
            {result.analyze.improvements?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-amber-600 mb-1">△ Improvements</p>
                <ul className="space-y-1">
                  {result.analyze.improvements.map((s, i) => <li key={i} className="text-xs text-slate-600 dark:text-slate-400">• {s}</li>)}
                </ul>
              </div>
            )}
            {result.analyze.overallFeedback && (
              <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-lg p-2 leading-relaxed">
                {result.analyze.overallFeedback}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPanel;
