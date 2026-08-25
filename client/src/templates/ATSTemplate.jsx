import { formatDate } from '@/utils/helpers';

/**
 * ATS Template — Plain single-column, no graphics, maximum keyword density
 * Designed to pass Applicant Tracking Systems that can't parse complex layouts.
 */
const ATSTemplate = ({ resume }) => {
  const { personalInfo = {}, experience = [], education = [], skills = [], projects = [],
    certifications = [], achievements = [], languages = [], customization = {} } = resume || {};

  const contacts = [
    personalInfo.email, personalInfo.phone, personalInfo.location,
    personalInfo.website, personalInfo.linkedin, personalInfo.github,
  ].filter(Boolean);

  return (
    <div style={{ fontFamily: "'Arial', 'Helvetica', sans-serif", backgroundColor: 'white', width: '210mm', minHeight: '297mm', padding: '20mm 22mm' }}
      className="shadow-lg text-[11pt]">

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-black tracking-wide">{personalInfo.fullName || 'Your Name'}</h1>
        {personalInfo.jobTitle && <p className="text-base text-black mt-0.5">{personalInfo.jobTitle}</p>}
        {contacts.length > 0 && (
          <p className="text-sm text-black mt-2">{contacts.join(' | ')}</p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t-2 border-black mb-4" />

      {/* Summary */}
      {personalInfo.summary && (
        <ATSSection title="PROFESSIONAL SUMMARY">
          <p className="text-sm text-black leading-relaxed">{personalInfo.summary}</p>
        </ATSSection>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <ATSSection title="WORK EXPERIENCE">
          {experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between flex-wrap">
                <span className="font-bold text-black">{exp.position}</span>
                <span className="text-sm text-black">
                  {formatDate(exp.startDate)} - {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <div className="flex justify-between flex-wrap">
                <span className="text-sm text-black">{exp.company}{exp.location && `, ${exp.location}`}</span>
              </div>
              {exp.description && <p className="text-sm text-black mt-1 leading-relaxed">{exp.description}</p>}
              {exp.bulletPoints?.length > 0 && (
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  {exp.bulletPoints.map((bp, j) => <li key={j} className="text-sm text-black">{bp}</li>)}
                </ul>
              )}
            </div>
          ))}
        </ATSSection>
      )}

      {/* Education */}
      {education.length > 0 && (
        <ATSSection title="EDUCATION">
          {education.map((edu, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between flex-wrap">
                <span className="font-bold text-black text-sm">{edu.degree}{edu.field && ` in ${edu.field}`}</span>
                <span className="text-sm text-black">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
              </div>
              <p className="text-sm text-black">{edu.institution}</p>
              {edu.grade && <p className="text-sm text-black">Grade: {edu.grade}</p>}
            </div>
          ))}
        </ATSSection>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <ATSSection title="TECHNICAL SKILLS">
          <p className="text-sm text-black">{skills.map((s) => s.name).join(', ')}</p>
        </ATSSection>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <ATSSection title="PROJECTS">
          {projects.map((proj, i) => (
            <div key={i} className="mb-3">
              <p className="font-bold text-black text-sm">{proj.title}</p>
              {proj.description && <p className="text-sm text-black leading-relaxed">{proj.description}</p>}
              {proj.technologies?.length > 0 && <p className="text-sm text-black">Technologies: {proj.technologies.join(', ')}</p>}
              {proj.liveUrl && <p className="text-sm text-black">URL: {proj.liveUrl}</p>}
            </div>
          ))}
        </ATSSection>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <ATSSection title="CERTIFICATIONS">
          {certifications.map((cert, i) => (
            <p key={i} className="text-sm text-black mb-1">
              {cert.name}{cert.issuer && ` - ${cert.issuer}`}{cert.date && ` (${formatDate(cert.date)})`}
            </p>
          ))}
        </ATSSection>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <ATSSection title="ACHIEVEMENTS">
          {achievements.map((ach, i) => (
            <div key={i} className="mb-1">
              <p className="font-bold text-sm text-black">{ach.title}</p>
              {ach.description && <p className="text-sm text-black">{ach.description}</p>}
            </div>
          ))}
        </ATSSection>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <ATSSection title="LANGUAGES">
          <p className="text-sm text-black">{languages.map((l) => `${l.language} (${l.proficiency})`).join(', ')}</p>
        </ATSSection>
      )}
    </div>
  );
};

const ATSSection = ({ title, children }) => (
  <div className="mb-4">
    <h2 className="font-bold text-black text-sm border-b border-black pb-0.5 mb-2">{title}</h2>
    {children}
  </div>
);

export default ATSTemplate;
