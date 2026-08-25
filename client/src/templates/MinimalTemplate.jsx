import { formatDate } from '@/utils/helpers';

/**
 * Minimal Template — Ultra-clean, lots of whitespace, dot-separator contacts
 */
const MinimalTemplate = ({ resume }) => {
  const { personalInfo = {}, experience = [], education = [], skills = [], projects = [],
    certifications = [], achievements = [], languages = [], customization = {} } = resume || {};

  const primaryColor = customization?.primaryColor || '#0f172a';
  const accentColor = customization?.primaryColor || '#4f52e1';

  const contacts = [
    personalInfo.email, personalInfo.phone, personalInfo.location,
    personalInfo.website, personalInfo.linkedin, personalInfo.github,
  ].filter(Boolean);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: 'white', width: '210mm', minHeight: '297mm', padding: '18mm 20mm' }}
      className="shadow-lg text-[10.5pt]">

      {/* Header — very minimal */}
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-1">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-base font-medium mb-3" style={{ color: accentColor }}>{personalInfo.jobTitle}</p>
        )}
        {contacts.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
            {contacts.map((c, i) => (
              <span key={i}>{c}{i < contacts.length - 1 && <span className="ml-3 text-slate-300">·</span>}</span>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <MinSection title="About" accent={accentColor}>
          <p className="text-sm text-slate-600 leading-relaxed">{personalInfo.summary}</p>
        </MinSection>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <MinSection title="Experience" accent={accentColor}>
          {experience.map((exp, i) => (
            <div key={i} className="mb-5">
              <div className="flex justify-between items-baseline flex-wrap gap-2 mb-0.5">
                <div>
                  <span className="font-semibold text-slate-900">{exp.position}</span>
                  <span className="text-slate-400 mx-2">@</span>
                  <span style={{ color: accentColor }} className="font-medium">{exp.company}</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {formatDate(exp.startDate)} – {exp.currentlyWorking ? 'Now' : formatDate(exp.endDate)}
                </span>
              </div>
              {exp.location && <p className="text-xs text-slate-400 mb-1">{exp.location}</p>}
              {exp.description && <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>}
              {exp.bulletPoints?.length > 0 && (
                <ul className="mt-1 space-y-0.5">
                  {exp.bulletPoints.map((bp, j) => (
                    <li key={j} className="text-xs text-slate-600 flex gap-2">
                      <span style={{ color: accentColor }} className="mt-0.5 flex-shrink-0">›</span>
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </MinSection>
      )}

      {/* Education */}
      {education.length > 0 && (
        <MinSection title="Education" accent={accentColor}>
          {education.map((edu, i) => (
            <div key={i} className="mb-3 flex justify-between flex-wrap gap-2">
              <div>
                <p className="font-semibold text-slate-900 text-sm">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                <p className="text-sm text-slate-500">{edu.institution}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-mono">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</p>
                {edu.grade && <p className="text-xs text-slate-400">{edu.grade}</p>}
              </div>
            </div>
          ))}
        </MinSection>
      )}

      {/* Skills — chips */}
      {skills.length > 0 && (
        <MinSection title="Skills" accent={accentColor}>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-full border" style={{ borderColor: `${accentColor}40`, color: accentColor }}>
                {skill.name}
              </span>
            ))}
          </div>
        </MinSection>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <MinSection title="Projects" accent={accentColor}>
          {projects.map((proj, i) => (
            <div key={i} className="mb-3">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-semibold text-slate-900 text-sm">{proj.title}</span>
                {proj.liveUrl && <a href={proj.liveUrl} style={{ color: accentColor }} className="text-xs">↗ Live</a>}
                {proj.githubUrl && <a href={proj.githubUrl} style={{ color: accentColor }} className="text-xs">↗ GitHub</a>}
              </div>
              {proj.description && <p className="text-xs text-slate-600">{proj.description}</p>}
              {proj.technologies?.length > 0 && (
                <p className="text-xs text-slate-400 mt-0.5">{proj.technologies.join(' · ')}</p>
              )}
            </div>
          ))}
        </MinSection>
      )}

      {/* Languages + Certifications in a row */}
      {(languages.length > 0 || certifications.length > 0) && (
        <div className="flex gap-8">
          {languages.length > 0 && (
            <MinSection title="Languages" accent={accentColor} className="flex-1">
              {languages.map((lang, i) => (
                <p key={i} className="text-xs text-slate-600">{lang.language} <span className="text-slate-400">({lang.proficiency})</span></p>
              ))}
            </MinSection>
          )}
          {certifications.length > 0 && (
            <MinSection title="Certifications" accent={accentColor} className="flex-1">
              {certifications.map((cert, i) => (
                <p key={i} className="text-xs text-slate-600 mb-0.5"><strong>{cert.name}</strong>{cert.issuer && ` · ${cert.issuer}`}</p>
              ))}
            </MinSection>
          )}
        </div>
      )}
    </div>
  );
};

const MinSection = ({ title, accent, children, className = '' }) => (
  <div className={`mb-6 ${className}`}>
    <div className="flex items-center gap-3 mb-3">
      <h2 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: accent }}>{title}</h2>
      <div className="flex-1 h-px" style={{ backgroundColor: `${accent}25` }} />
    </div>
    {children}
  </div>
);

export default MinimalTemplate;
