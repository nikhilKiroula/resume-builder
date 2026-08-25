import { formatDate } from '@/utils/helpers';

/**
 * Creative Template — Bold header, decorative accents, left timeline for experience
 */
const CreativeTemplate = ({ resume }) => {
  const { personalInfo = {}, experience = [], education = [], skills = [], projects = [],
    certifications = [], achievements = [], languages = [], customization = {} } = resume || {};

  const primaryColor = customization?.primaryColor || '#ea580c';

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: 'white', width: '210mm', minHeight: '297mm' }}
      className="shadow-lg text-[10.5pt]">

      {/* Bold hero header */}
      <div style={{ backgroundColor: primaryColor }} className="px-8 py-8 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white opacity-5" />
        <div className="absolute -bottom-5 right-20 w-20 h-20 rounded-full bg-white opacity-10" />

        <div className="relative z-10 flex items-center gap-6">
          {personalInfo.profileImage ? (
            <img src={personalInfo.profileImage} alt={personalInfo.fullName}
              className="w-20 h-20 rounded-full object-cover border-4 border-white/40 flex-shrink-0" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white text-3xl font-black border-4 border-white/30 flex-shrink-0">
              {personalInfo.fullName?.[0] || 'R'}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">{personalInfo.fullName || 'Your Name'}</h1>
            {personalInfo.jobTitle && <p className="text-base text-white/80 mt-0.5 font-medium">{personalInfo.jobTitle}</p>}
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2">
              {[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).map((c, i) => (
                <span key={i} className="text-xs text-white/70">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex" style={{ minHeight: 'calc(297mm - 130px)' }}>
        {/* Left column */}
        <div className="w-5/12 px-6 py-5 bg-slate-50 space-y-5">
          {personalInfo.summary && (
            <CrtSection title="About Me" color={primaryColor}>
              <p className="text-xs text-slate-600 leading-relaxed">{personalInfo.summary}</p>
            </CrtSection>
          )}
          {skills.length > 0 && (
            <CrtSection title="Skills" color={primaryColor}>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded text-white font-medium" style={{ backgroundColor: primaryColor }}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </CrtSection>
          )}
          {education.length > 0 && (
            <CrtSection title="Education" color={primaryColor}>
              {education.map((edu, i) => (
                <div key={i} className="mb-2">
                  <p className="font-semibold text-slate-900 text-xs">{edu.degree}{edu.field && ` · ${edu.field}`}</p>
                  <p className="text-xs text-slate-600">{edu.institution}</p>
                  <p className="text-xs text-slate-400">{formatDate(edu.startDate)} — {formatDate(edu.endDate)}</p>
                </div>
              ))}
            </CrtSection>
          )}
          {languages.length > 0 && (
            <CrtSection title="Languages" color={primaryColor}>
              {languages.map((lang, i) => (
                <div key={i} className="flex justify-between text-xs text-slate-600 mb-0.5">
                  <span>{lang.language}</span>
                  <span className="text-slate-400">{lang.proficiency}</span>
                </div>
              ))}
            </CrtSection>
          )}
          {certifications.length > 0 && (
            <CrtSection title="Certifications" color={primaryColor}>
              {certifications.map((cert, i) => (
                <p key={i} className="text-xs text-slate-600 mb-0.5"><strong>{cert.name}</strong></p>
              ))}
            </CrtSection>
          )}
        </div>

        {/* Right column */}
        <div className="flex-1 px-6 py-5 space-y-5">
          {/* Experience timeline */}
          {experience.length > 0 && (
            <CrtSection title="Experience" color={primaryColor}>
              <div className="space-y-4">
                {experience.map((exp, i) => (
                  <div key={i} className="flex gap-3">
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full border-2 flex-shrink-0 mt-1" style={{ borderColor: primaryColor, backgroundColor: primaryColor }} />
                      {i < experience.length - 1 && <div className="w-0.5 flex-1 mt-1" style={{ backgroundColor: `${primaryColor}30` }} />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex justify-between flex-wrap gap-1">
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{exp.position}</h3>
                          <p className="text-sm font-medium" style={{ color: primaryColor }}>{exp.company}</p>
                        </div>
                        <span className="text-xs text-slate-400">
                          {formatDate(exp.startDate)} – {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}
                        </span>
                      </div>
                      {exp.description && <p className="text-xs text-slate-600 mt-1 leading-relaxed">{exp.description}</p>}
                      {exp.bulletPoints?.length > 0 && (
                        <ul className="mt-1 space-y-0.5">
                          {exp.bulletPoints.map((bp, j) => (
                            <li key={j} className="text-xs text-slate-600 flex gap-1.5">
                              <span style={{ color: primaryColor }}>•</span> {bp}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CrtSection>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <CrtSection title="Projects" color={primaryColor}>
              {projects.map((proj, i) => (
                <div key={i} className="mb-3 border-l-2 pl-3" style={{ borderColor: `${primaryColor}40` }}>
                  <h4 className="font-semibold text-slate-900 text-sm">{proj.title}</h4>
                  {proj.description && <p className="text-xs text-slate-600 mt-0.5">{proj.description}</p>}
                  {proj.technologies?.length > 0 && <p className="text-xs text-slate-400 mt-0.5">{proj.technologies.join(' · ')}</p>}
                </div>
              ))}
            </CrtSection>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <CrtSection title="Achievements" color={primaryColor}>
              {achievements.map((ach, i) => (
                <div key={i} className="mb-1.5">
                  <p className="text-xs font-semibold text-slate-900">{ach.title}</p>
                  {ach.description && <p className="text-xs text-slate-600">{ach.description}</p>}
                </div>
              ))}
            </CrtSection>
          )}
        </div>
      </div>
    </div>
  );
};

const CrtSection = ({ title, color, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
      <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-700">{title}</h2>
    </div>
    {children}
  </div>
);

export default CreativeTemplate;
