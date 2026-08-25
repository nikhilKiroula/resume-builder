import { formatDate } from '@/utils/helpers';

/**
 * Classic Template — Traditional single-column, serif typography, centered header
 */
const ClassicTemplate = ({ resume }) => {
  const { personalInfo = {}, experience = [], education = [], skills = [], projects = [],
    certifications = [], achievements = [], languages = [], customization = {} } = resume || {};

  const primaryColor = customization?.primaryColor || '#1e293b';
  const fontFamily = customization?.fontFamily || 'Georgia';

  return (
    <div style={{ fontFamily: `'${fontFamily}', Georgia, serif`, backgroundColor: 'white', width: '210mm', minHeight: '297mm', padding: '20mm' }}
      className="shadow-lg text-[11pt]">

      {/* Header */}
      <div className="text-center border-b-2 pb-4 mb-5" style={{ borderColor: primaryColor }}>
        <h1 className="text-3xl font-bold tracking-wide" style={{ color: primaryColor }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-base mt-1 text-slate-600 italic">{personalInfo.jobTitle}</p>
        )}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 text-xs text-slate-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <Section title="Professional Summary" color={primaryColor}>
          <p className="text-sm text-slate-700 leading-relaxed">{personalInfo.summary}</p>
        </Section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <Section title="Work Experience" color={primaryColor}>
          {experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-baseline flex-wrap">
                <span className="font-bold text-slate-900">{exp.position}</span>
                <span className="text-xs text-slate-500">{formatDate(exp.startDate)} — {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}</span>
              </div>
              <div className="flex justify-between flex-wrap">
                <span className="italic text-slate-700 text-sm">{exp.company}</span>
                {exp.location && <span className="text-xs text-slate-500">{exp.location}</span>}
              </div>
              {exp.description && <p className="text-xs mt-1 text-slate-700 leading-relaxed">{exp.description}</p>}
              {exp.bulletPoints?.length > 0 && (
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  {exp.bulletPoints.map((bp, j) => <li key={j} className="text-xs text-slate-700">{bp}</li>)}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Section title="Education" color={primaryColor}>
          {education.map((edu, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between flex-wrap">
                <span className="font-bold text-slate-900 text-sm">{edu.degree} {edu.field && `in ${edu.field}`}</span>
                <span className="text-xs text-slate-500">{formatDate(edu.startDate)} — {formatDate(edu.endDate)}</span>
              </div>
              <div className="flex justify-between flex-wrap">
                <span className="italic text-slate-700 text-sm">{edu.institution}</span>
                {edu.grade && <span className="text-xs text-slate-500">Grade: {edu.grade}</span>}
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Section title="Skills" color={primaryColor}>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span key={i} className="text-xs px-2 py-0.5 border border-slate-300 rounded">{skill.name}</span>
            ))}
          </div>
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="Projects" color={primaryColor}>
          {projects.map((proj, i) => (
            <div key={i} className="mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 text-sm">{proj.title}</span>
                {proj.liveUrl && <a href={proj.liveUrl} className="text-xs underline text-slate-600">Live</a>}
                {proj.githubUrl && <a href={proj.githubUrl} className="text-xs underline text-slate-600">GitHub</a>}
              </div>
              {proj.description && <p className="text-xs text-slate-700 mt-0.5">{proj.description}</p>}
              {proj.technologies?.length > 0 && <p className="text-xs text-slate-500 mt-0.5">{proj.technologies.join(' · ')}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Section title="Certifications" color={primaryColor}>
          {certifications.map((cert, i) => (
            <p key={i} className="text-sm text-slate-700">
              <strong>{cert.name}</strong>{cert.issuer && ` — ${cert.issuer}`}{cert.date && `, ${formatDate(cert.date)}`}
            </p>
          ))}
        </Section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <Section title="Languages" color={primaryColor}>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {languages.map((lang, i) => (
              <span key={i} className="text-sm text-slate-700">{lang.language} <em className="text-slate-500 text-xs">({lang.proficiency})</em></span>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

const Section = ({ title, color, children }) => (
  <div className="mb-4">
    <h2 className="text-sm font-bold uppercase tracking-widest mb-2 pb-0.5" style={{ color, borderBottom: `1px solid ${color}60` }}>{title}</h2>
    {children}
  </div>
);

export default ClassicTemplate;
