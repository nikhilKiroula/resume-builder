import { Link } from 'react-router-dom';
import {
  ArrowRight, Sparkles, FileText, Eye, Target, Download,
  Layers, Share2, Palette, Zap, CheckCircle, Star,
  ChevronRight, Users, TrendingUp,
} from 'lucide-react';

const features = [
  { icon: FileText, title: 'Easy Resume Builder', desc: 'Intuitive form-based editor with live preview. No design skills required.', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
  { icon: Eye, title: 'Live Preview', desc: 'See exactly how your resume looks as you type. What you see is what you get.', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
  { icon: Target, title: 'ATS-Friendly', desc: 'Templates designed to pass Applicant Tracking Systems used by top employers.', color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
  { icon: Sparkles, title: 'AI Assistance', desc: 'Generate professional summaries and bullet points with AI when configured.', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
  { icon: Download, title: 'PDF Export', desc: 'Download your resume as a perfectly formatted PDF, ready to send.', color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' },
  { icon: Layers, title: 'Multiple Resumes', desc: 'Create and manage different resumes for different roles from one dashboard.', color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' },
  { icon: Palette, title: 'Customization', desc: 'Personalize colors, fonts, spacing, and layout to match your style.', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' },
  { icon: Share2, title: 'Public Sharing', desc: 'Share a live link to your resume. Perfect for LinkedIn or portfolio sites.', color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' },
];

const templates = [
  { name: 'Modern', desc: 'Clean two-column with colored sidebar', color: 'from-blue-500 to-indigo-600' },
  { name: 'Classic', desc: 'Traditional single-column, timeless', color: 'from-slate-600 to-slate-800' },
  { name: 'Minimal', desc: 'Ultra-clean with generous whitespace', color: 'from-emerald-500 to-teal-600' },
  { name: 'Professional', desc: 'Corporate-ready, structured layout', color: 'from-violet-500 to-purple-600' },
  { name: 'Creative', desc: 'Bold accents for creative fields', color: 'from-orange-500 to-rose-600' },
  { name: 'ATS Focused', desc: 'Plain, keyword-optimized layout', color: 'from-sky-500 to-cyan-600' },
];

const steps = [
  { num: '01', title: 'Create Your Resume', desc: 'Sign up free and create a resume. Fill in your details using our guided form.' },
  { num: '02', title: 'Choose & Customize', desc: 'Pick from 6 professional templates. Customize colors, fonts, and layout to your taste.' },
  { num: '03', title: 'Download & Apply', desc: 'Export as a perfect PDF. Share your public link or send it directly to employers.' },
];

const stats = [
  { value: '6', label: 'Professional Templates' },
  { value: 'A4', label: 'Perfect PDF Output' },
  { value: 'ATS', label: 'Optimized Format' },
  { value: '∞', label: 'Resumes to Create' },
];

const LandingPage = () => {
  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-100 dark:bg-brand-900/20 blur-3xl opacity-60" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-indigo-100 dark:bg-indigo-900/20 blur-3xl opacity-40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Resume Builder
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6 animate-slide-up">
            Build a Professional Resume{' '}
            <span className="text-gradient">That Gets Noticed</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
            Create ATS-friendly resumes with live preview, 6 professional templates,
            AI assistance, and instant PDF export. Land your dream job faster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link to="/register" className="btn btn-primary btn-xl gap-2 shadow-glow">
              Create My Resume
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#templates" className="btn btn-secondary btn-xl">
              Explore Templates
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-3xl font-extrabold text-brand-600">{stat.value}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 lg:py-28 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything You Need to Land the Job
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Powerful features designed to make resume building effortless and effective.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card-hover p-6 group">
                <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Get Your Resume Ready in Minutes
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Three simple steps to a professional resume that opens doors.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200" />

            {steps.map(({ num, title, desc }) => (
              <div key={num} className="relative text-center">
                <div className="relative inline-flex mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-brand-600 flex items-center justify-center shadow-glow mx-auto">
                    <span className="text-2xl font-extrabold text-white">{num}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Templates ────────────────────────────────────────────────────── */}
      <section id="templates" className="py-20 lg:py-28 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              6 Professional Templates
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Professionally designed layouts. Switch templates instantly — your data stays intact.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map(({ name, desc, color }) => (
              <div key={name} className="card-hover overflow-hidden group">
                {/* Template preview mockup */}
                <div className={`h-48 bg-gradient-to-br ${color} relative overflow-hidden`}>
                  {/* Mockup lines */}
                  <div className="absolute inset-4 flex gap-3">
                    <div className="w-1/3 space-y-2">
                      <div className="h-12 w-12 rounded-full bg-white/30" />
                      <div className="h-2 bg-white/40 rounded w-full" />
                      <div className="h-2 bg-white/30 rounded w-3/4" />
                      <div className="h-2 bg-white/20 rounded w-1/2" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="h-2 bg-white/40 rounded w-3/4" />
                      <div className="h-1.5 bg-white/25 rounded w-full" />
                      <div className="h-1.5 bg-white/25 rounded w-5/6" />
                      <div className="h-2 bg-white/35 rounded w-2/3 mt-3" />
                      <div className="h-1.5 bg-white/20 rounded w-full" />
                      <div className="h-1.5 bg-white/20 rounded w-4/5" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white font-medium text-sm bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                      Use Template
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-gradient-brand">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
            Your Dream Job Starts With a Great Resume
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
            Join thousands of job seekers who built their winning resume with Resumely.
            Get started for free — no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn bg-white text-brand-700 hover:bg-slate-50 btn-xl font-semibold shadow-lg">
              Create My Resume Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="btn border-2 border-white/40 text-white hover:bg-white/10 btn-xl">
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
