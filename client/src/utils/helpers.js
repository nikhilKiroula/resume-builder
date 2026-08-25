import { formatDistanceToNow, format, parseISO } from 'date-fns';

/**
 * Format a date string for display
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return format(parseISO(dateStr), 'MMM yyyy');
  } catch {
    return dateStr;
  }
};

/**
 * Format a timestamp to relative time (e.g. "3 days ago")
 */
export const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return '';
  }
};

/**
 * Calculate completion score for a resume
 */
export const calculateCompletion = (resume) => {
  if (!resume) return { overall: 0, sections: {} };

  const sections = {
    personalInfo: checkPersonalInfo(resume.personalInfo),
    summary: resume.personalInfo?.summary?.length > 50 ? 100 : resume.personalInfo?.summary?.length > 0 ? 50 : 0,
    experience: resume.experience?.length > 0 ? Math.min(100, resume.experience.length * 50) : 0,
    education: resume.education?.length > 0 ? 100 : 0,
    skills: resume.skills?.length >= 5 ? 100 : resume.skills?.length > 0 ? Math.round((resume.skills.length / 5) * 100) : 0,
    projects: resume.projects?.length > 0 ? 100 : 0,
  };

  const weights = { personalInfo: 0.25, summary: 0.20, experience: 0.20, education: 0.15, skills: 0.10, projects: 0.10 };
  const overall = Math.round(Object.entries(sections).reduce((acc, [k, v]) => acc + v * weights[k], 0));

  return { overall, sections };
};

const checkPersonalInfo = (info) => {
  if (!info) return 0;
  const fields = ['fullName', 'email', 'phone', 'location', 'jobTitle'];
  const filled = fields.filter((f) => info[f]?.trim()?.length > 0).length;
  return Math.round((filled / fields.length) * 100);
};

/**
 * Generate an ATS score from resume data
 */
export const calculateATSScore = (resume) => {
  let score = 0;
  const suggestions = [];

  if (resume?.personalInfo?.summary?.length > 100) score += 15;
  else suggestions.push('Add a detailed professional summary');

  if (resume?.experience?.length > 0) {
    const withDesc = resume.experience.filter((e) => e.description?.length > 50 || e.bulletPoints?.length > 0);
    if (withDesc.length > 0) score += 25;
    else suggestions.push('Add descriptions to your work experience');
  } else suggestions.push('Add work experience');

  if (resume?.education?.length > 0) score += 15;
  else suggestions.push('Add education details');

  if (resume?.skills?.length >= 5) score += 20;
  else if (resume?.skills?.length > 0) { score += 10; suggestions.push('Add at least 5 skills'); }
  else suggestions.push('Add relevant skills');

  if (resume?.personalInfo?.email && resume?.personalInfo?.phone) score += 10;
  else suggestions.push('Add email and phone number');

  if (resume?.personalInfo?.jobTitle) score += 5;
  else suggestions.push('Add your job title');

  if (resume?.projects?.length > 0 || resume?.certifications?.length > 0) score += 10;

  const final = Math.min(100, score);
  return {
    score: final,
    grade: final >= 80 ? 'Excellent' : final >= 60 ? 'Good' : final >= 40 ? 'Fair' : 'Needs Work',
    suggestions,
  };
};

/**
 * Generate a public resume URL
 */
export const getPublicUrl = (slug) => {
  return `${window.location.origin}/resume/public/${slug}`;
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Debounce a function
 */
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Get initials from a name
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Truncate text
 */
export const truncate = (str, n) => {
  if (!str) return '';
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
};

/**
 * Color contrast checker — returns 'light' or 'dark' for a given hex color
 */
export const getContrastColor = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'dark' : 'light';
};
