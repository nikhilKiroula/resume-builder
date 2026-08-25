import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';
import { formatDate } from '@/utils/helpers';

// LinkedIn and Github not in current lucide-react — inline SVG
const LinkedinIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
);
const GithubIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
);

/**
 * Modern Template — Two-column layout with colored left sidebar
 */
const ModernTemplate = ({ resume }) => {
  const { personalInfo = {}, experience = [], education = [], skills = [], projects = [],
    certifications = [], achievements = [], languages = [], customization = {}, sectionOrder = [] } = resume || {};

  const primaryColor = customization?.primaryColor || '#4f52e1';
  const fontFamily = customization?.fontFamily || 'Inter';

  const sectionStyle = { fontFamily: `'${fontFamily}', Inter, sans-serif` };

  const contactItems = [
    personalInfo.email && { icon: Mail, label: personalInfo.email, href: `mailto:${personalInfo.email}` },
    personalInfo.phone && { icon: Phone, label: personalInfo.phone },
    personalInfo.location && { icon: MapPin, label: personalInfo.location },
    personalInfo.website && { icon: Globe, label: personalInfo.website, href: personalInfo.website },
    personalInfo.linkedin && { icon: LinkedinIcon, label: 'LinkedIn', href: personalInfo.linkedin },
    personalInfo.github && { icon: GithubIcon, label: 'GitHub', href: personalInfo.github },
  ].filter(Boolean);

  return (
    <div
      style={{ ...sectionStyle, backgroundColor: 'white', width: '210mm', minHeight: '297mm' }}
      className="shadow-lg text-[11pt] leading-relaxed"
    >
      <div className="flex min-h-full" style={{ minHeight: '297mm' }}>
        {/* Left sidebar */}
        <div style={{ backgroundColor: primaryColor, width: '33%', minHeight: '297mm' }} className="p-6 text-white">
          {/* Profile image */}
          {personalInfo.profileImage ? (
            <img src={personalInfo.profileImage} alt={personalInfo.fullName}
              className="w-24 h-24 rounded-full object-cover mb-4 mx-auto border-4 border-white/30" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4 mx-auto text-2xl font-bold">
              {personalInfo.fullName?.[0] || 'R'}
            </div>
          )}

          {/* Name */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold leading-tight">{personalInfo.fullName || 'Your Name'}</h1>
            {personalInfo.jobTitle && <p className="text-sm text-white/80 mt-1">{personalInfo.jobTitle}</p>}
          </div>

          {/* Contact */}
          {contactItems.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-3">Contact</h2>
              <div className="space-y-2">
                {contactItems.map(({ icon: Icon, label, href }, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <Icon className="w-3 h-3 mt-0.5 flex-shrink-0 opacity-70" />
                    {href ? <a href={href} className="text-white/90 hover:text-white break-all">{label}</a>
                      : <span className="text-white/90 break-all">{label}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-3">Skills</h2>
              <div className="space-y-1.5">
                {skills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span>{skill.name}</span>
                      <span className="text-white/60">{skill.level}</span>
                    </div>
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white/70 rounded-full"
                        style={{ width: skill.level === 'Expert' ? '95%' : skill.level === 'Advanced' ? '80%' : skill.level === 'Intermediate' ? '60%' : '35%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-3">Languages</h2>
              <div className="space-y-1">
                {languages.map((lang, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span>{lang.language}</span>
                    <span className="text-white/60">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right main content */}
        <div className="flex-1 p-6 space-y-5">
          {/* Summary */}
          {personalInfo.summary && (
            <div>
              <SectionHeading title="Professional Summary" color={primaryColor} />
              <p className="text-sm text-slate-600 leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div>
              <SectionHeading title="Experience" color={primaryColor} />
              <div className="space-y-4">
                {experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-start flex-wrap gap-1">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm">{exp.position}</h3>
                        <p className="text-sm font-medium" style={{ color: primaryColor }}>{exp.company}</p>
                      </div>
                      <div className="text-right text-xs text-slate-500">
                        <p>{formatDate(exp.startDate)} — {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}</p>
                        {exp.location && <p>{exp.location}</p>}
                      </div>
                    </div>
                    {exp.description && <p className="text-xs text-slate-600 mt-1 leading-relaxed">{exp.description}</p>}
                    {exp.bulletPoints?.length > 0 && (
                      <ul className="list-disc list-inside space-y-0.5 mt-1">
                        {exp.bulletPoints.map((bp, j) => <li key={j} className="text-xs text-slate-600">{bp}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <SectionHeading title="Education" color={primaryColor} />
              <div className="space-y-3">
                {education.map((edu, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-start flex-wrap gap-1">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                        <p className="text-sm" style={{ color: primaryColor }}>{edu.institution}</p>
                      </div>
                      <div className="text-right text-xs text-slate-500">
                        <p>{formatDate(edu.startDate)} — {formatDate(edu.endDate)}</p>
                        {edu.grade && <p>Grade: {edu.grade}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <SectionHeading title="Projects" color={primaryColor} />
              <div className="space-y-3">
                {projects.map((proj, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-900 text-sm">{proj.title}</h3>
                      {proj.liveUrl && <a href={proj.liveUrl} className="text-xs" style={{ color: primaryColor }}>Live ↗</a>}
                      {proj.githubUrl && <a href={proj.githubUrl} className="text-xs" style={{ color: primaryColor }}>GitHub ↗</a>}
                    </div>
                    {proj.description && <p className="text-xs text-slate-600 mt-0.5">{proj.description}</p>}
                    {proj.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {proj.technologies.map((tech, j) => (
                          <span key={j} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <SectionHeading title="Certifications" color={primaryColor} />
              <div className="space-y-1.5">
                {certifications.map((cert, i) => (
                  <div key={i} className="flex justify-between text-sm flex-wrap gap-1">
                    <div>
                      <span className="font-medium text-slate-900">{cert.name}</span>
                      {cert.issuer && <span className="text-slate-500"> — {cert.issuer}</span>}
                    </div>
                    {cert.date && <span className="text-xs text-slate-400">{formatDate(cert.date)}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <div>
              <SectionHeading title="Achievements" color={primaryColor} />
              <div className="space-y-1.5">
                {achievements.map((ach, i) => (
                  <div key={i}>
                    <p className="text-sm font-medium text-slate-900">{ach.title}</p>
                    {ach.description && <p className="text-xs text-slate-600">{ach.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SectionHeading = ({ title, color }) => (
  <div className="mb-2">
    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color }}>{title}</h2>
    <div className="h-0.5 rounded-full mt-0.5" style={{ backgroundColor: `${color}40` }} />
  </div>
);

export default ModernTemplate;
