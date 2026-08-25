import { formatDate } from '@/utils/helpers';

/**
 * Professional Template — Corporate, structured, top accent bar, two columns for skills/info
 */
const ProfessionalTemplate = ({ resume }) => {
  const { personalInfo = {}, experience = [], education = [], skills = [], projects = [],
    certifications = [], achievements = [], languages = [], customization = {} } = resume || {};

  const primaryColor = customization?.primaryColor || '#1e40af';

  const contacts = [
    personalInfo.email && { label: personalInfo.email },
    personalInfo.phone && { label: personalInfo.phone },
    personalInfo.location && { label: personalInfo.location },
    personalInfo.linkedin && { label: personalInfo.linkedin },
    personalInfo.github && { label: personalInfo.github },
  ].filter(Boolean);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: 'white', width: '210mm', minHeight: '297mm' }}
      className="shadow-lg text-[10.5pt]">

      {/* Top accent bar */}
      <div style={{ backgroundColor: primaryColor, height: '6px' }} />

      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{personalInfo.fullName || 'Your Name'}</h1>
            {personalInfo.jobTitle && (
              <p className="text-lg font-semibold mt-0.5" style={{ color: primaryColor }}>{personalInfo.jobTitle}</p>
            )}
          </div>
          <div className="text-right text-xs text-slate-500 space-y-0.5">
            {contacts.map((c, i) => <p key={i}>{c.label}</p>)}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-8 py-5 space-y-5">
        {/* Summary */}
        {personalInfo.summary && (
          <ProSection title="Professional Summary" color={primaryColor}>
            <p className="text-sm text-slate-700 leading-relaxed">{personalInfo.summary}</p>
          </ProSection>
        )}

        {/* Core Competencies (skills) */}
        {skills.length > 0 && (
          <ProSection title="Core Competencies" color={primaryColor}>
            <div className="grid grid-cols-3 gap-1">
              {skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700">
                  <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: primaryColor }} />
                  {skill.name}
                </div>
              ))}
            </div>
          </ProSection>
        )}

        {/* Professional Experience */}
        {experience.length > 0 && (
          <ProSection title="Professional Experience" color={primaryColor}>
            {experience.map((exp, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between items-start flex-wrap gap-1">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{exp.position}</h3>
                    <p className="font-semibold text-sm" style={{ color: primaryColor }}>{exp.company}{exp.location && `, ${exp.location}`}</p>
                  </div>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">
                    {formatDate(exp.startDate)} — {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.description && <p className="text-xs text-slate-600 mt-1 leading-relaxed">{exp.description}</p>}
                {exp.bulletPoints?.length > 0 && (
                  <ul className="mt-1.5 space-y-1">
                    {exp.bulletPoints.map((bp, j) => (
                      <li key={j} className="flex gap-2 text-xs text-slate-600">
                        <span className="font-bold" style={{ color: primaryColor }}>▪</span> {bp}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </ProSection>
        )}

        {/* Two-col bottom: Education + Certifications */}
        <div className="grid grid-cols-2 gap-6">
          {education.length > 0 && (
            <ProSection title="Education" color={primaryColor}>
              {education.map((edu, i) => (
                <div key={i} className="mb-2">
                  <p className="font-semibold text-slate-900 text-sm">{edu.degree}{edu.field && ` in ${edu.field}`}</p>
                  <p className="text-sm text-slate-600">{edu.institution}</p>
                  <p className="text-xs text-slate-400">{formatDate(edu.startDate)} — {formatDate(edu.endDate)}</p>
                  {edu.grade && <p className="text-xs text-slate-400">GPA / Grade: {edu.grade}</p>}
                </div>
              ))}
            </ProSection>
          )}
          {(certifications.length > 0 || achievements.length > 0 || languages.length > 0) && (
            <div>
              {certifications.length > 0 && (
                <ProSection title="Certifications" color={primaryColor}>
                  {certifications.map((cert, i) => (
                    <p key={i} className="text-xs text-slate-600 mb-1"><strong>{cert.name}</strong>{cert.issuer && ` · ${cert.issuer}`}</p>
                  ))}
                </ProSection>
              )}
              {languages.length > 0 && (
                <ProSection title="Languages" color={primaryColor}>
                  {languages.map((lang, i) => (
                    <p key={i} className="text-xs text-slate-600">{lang.language} <span className="text-slate-400">({lang.proficiency})</span></p>
                  ))}
                </ProSection>
              )}
            </div>
          )}
        </div>

        {/* Projects */}
        {projects.length > 0 && (
          <ProSection title="Notable Projects" color={primaryColor}>
            <div className="grid grid-cols-2 gap-4">
              {projects.map((proj, i) => (
                <div key={i} className="border border-slate-200 rounded p-3">
                  <h4 className="font-semibold text-slate-900 text-xs mb-0.5">{proj.title}</h4>
                  {proj.description && <p className="text-xs text-slate-600">{proj.description}</p>}
                  {proj.technologies?.length > 0 && <p className="text-xs text-slate-400 mt-1">{proj.technologies.join(', ')}</p>}
                </div>
              ))}
            </div>
          </ProSection>
        )}
      </div>
    </div>
  );
};

const ProSection = ({ title, color, children }) => (
  <div className="mb-4">
    <h2 className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{ color }}>
      {title}
    </h2>
    <div className="h-px mb-2" style={{ backgroundColor: `${color}30` }} />
    {children}
  </div>
);

export default ProfessionalTemplate;
