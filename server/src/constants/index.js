// Application-wide constants

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
};

export const RESUME_TEMPLATES = [
  'modern',
  'classic',
  'minimal',
  'professional',
  'creative',
  'ats',
];

export const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export const LANGUAGE_PROFICIENCY = [
  'Elementary',
  'Limited Working',
  'Professional Working',
  'Full Professional',
  'Native / Bilingual',
];

export const DEFAULT_SECTION_ORDER = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'achievements',
  'languages',
];

export const DEFAULT_CUSTOMIZATION = {
  primaryColor: '#2563eb',
  fontFamily: 'Inter',
  fontSize: 'medium',
  headingSize: 'large',
  lineSpacing: 'normal',
  sectionSpacing: 'normal',
  margins: 'normal',
};
