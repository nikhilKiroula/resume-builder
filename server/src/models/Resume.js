import mongoose from 'mongoose';
import { DEFAULT_SECTION_ORDER, DEFAULT_CUSTOMIZATION, RESUME_TEMPLATES } from '../constants/index.js';

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const personalInfoSchema = new mongoose.Schema({
  fullName: { type: String, default: '' },
  jobTitle: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  profileImage: { type: String, default: null },
  summary: { type: String, default: '' },
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  company: { type: String, default: '' },
  position: { type: String, default: '' },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  currentlyWorking: { type: Boolean, default: false },
  description: { type: String, default: '' },
  bulletPoints: [{ type: String }],
  order: { type: Number, default: 0 },
});

const educationSchema = new mongoose.Schema({
  institution: { type: String, default: '' },
  degree: { type: String, default: '' },
  field: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  grade: { type: String, default: '' },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const skillSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  level: { type: String, default: 'Intermediate' },
  category: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const projectSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  technologies: [{ type: String }],
  liveUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const certificationSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  issuer: { type: String, default: '' },
  date: { type: String, default: '' },
  credentialUrl: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const achievementSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const languageSchema = new mongoose.Schema({
  language: { type: String, default: '' },
  proficiency: { type: String, default: 'Professional Working' },
  order: { type: Number, default: 0 },
});

const customSectionItemSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  date: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const customSectionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, default: 'Custom Section' },
  items: [customSectionItemSchema],
  enabled: { type: Boolean, default: true },
});

const customizationSchema = new mongoose.Schema({
  primaryColor: { type: String, default: '#2563eb' },
  fontFamily: { type: String, default: 'Inter' },
  fontSize: { type: String, default: 'medium' },
  headingSize: { type: String, default: 'large' },
  lineSpacing: { type: String, default: 'normal' },
  sectionSpacing: { type: String, default: 'normal' },
  margins: { type: String, default: 'normal' },
}, { _id: false });

// ─── Main Resume Schema ────────────────────────────────────────────────────────

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Resume title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
      default: 'My Resume',
    },
    selectedTemplate: {
      type: String,
      enum: RESUME_TEMPLATES,
      default: 'modern',
    },
    personalInfo: {
      type: personalInfoSchema,
      default: () => ({}),
    },
    experience: {
      type: [experienceSchema],
      default: [],
    },
    education: {
      type: [educationSchema],
      default: [],
    },
    skills: {
      type: [skillSchema],
      default: [],
    },
    projects: {
      type: [projectSchema],
      default: [],
    },
    certifications: {
      type: [certificationSchema],
      default: [],
    },
    achievements: {
      type: [achievementSchema],
      default: [],
    },
    languages: {
      type: [languageSchema],
      default: [],
    },
    customSections: {
      type: [customSectionSchema],
      default: [],
    },
    // Section visibility & order
    sectionOrder: {
      type: [String],
      default: DEFAULT_SECTION_ORDER,
    },
    sectionVisibility: {
      type: Map,
      of: Boolean,
      default: () => new Map(),
    },
    // Design customization
    customization: {
      type: customizationSchema,
      default: () => ({ ...DEFAULT_CUSTOMIZATION }),
    },
    // Public sharing
    isPublic: {
      type: Boolean,
      default: false,
    },
    publicSlug: {
      type: String,
      unique: true,
      sparse: true, // Only index non-null values
      default: null,
    },
    // Metadata
    lastEditedSection: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
resumeSchema.index({ userId: 1, createdAt: -1 });
resumeSchema.index({ publicSlug: 1 }, { sparse: true });

// Virtual: completion score
resumeSchema.virtual('completionScore').get(function () {
  return calculateCompletion(this);
});

// Virtual: ATS score
resumeSchema.virtual('atsScore').get(function () {
  return calculateATS(this);
});

resumeSchema.set('toJSON', { virtuals: true });
resumeSchema.set('toObject', { virtuals: true });

// ─── Completion Calculator ─────────────────────────────────────────────────────

function calculateCompletion(resume) {
  const checks = {
    personalInfo: checkPersonalInfo(resume.personalInfo),
    summary: resume.personalInfo?.summary?.length > 50 ? 100 : resume.personalInfo?.summary?.length > 0 ? 50 : 0,
    experience: resume.experience?.length > 0 ? Math.min(100, resume.experience.length * 50) : 0,
    education: resume.education?.length > 0 ? 100 : 0,
    skills: resume.skills?.length >= 5 ? 100 : resume.skills?.length > 0 ? Math.round((resume.skills.length / 5) * 100) : 0,
    projects: resume.projects?.length > 0 ? 100 : 0,
    certifications: resume.certifications?.length > 0 ? 100 : 50,
  };

  const weights = {
    personalInfo: 0.25,
    summary: 0.20,
    experience: 0.20,
    education: 0.15,
    skills: 0.10,
    projects: 0.05,
    certifications: 0.05,
  };

  let total = 0;
  for (const key in checks) {
    total += checks[key] * weights[key];
  }

  return {
    overall: Math.round(total),
    sections: checks,
  };
}

function checkPersonalInfo(info) {
  if (!info) return 0;
  const fields = ['fullName', 'email', 'phone', 'location', 'jobTitle'];
  const filled = fields.filter(f => info[f] && info[f].trim().length > 0).length;
  return Math.round((filled / fields.length) * 100);
}

function calculateATS(resume) {
  let score = 0;
  const suggestions = [];

  // Has professional summary
  if (resume.personalInfo?.summary?.length > 100) {
    score += 15;
  } else {
    suggestions.push('Add a detailed professional summary (100+ characters)');
  }

  // Has work experience with descriptions
  if (resume.experience?.length > 0) {
    const withDesc = resume.experience.filter(e => e.description?.length > 50 || e.bulletPoints?.length > 0);
    if (withDesc.length > 0) score += 25;
    else suggestions.push('Add descriptions or bullet points to your work experience');
  } else {
    suggestions.push('Add work experience to your resume');
  }

  // Has education
  if (resume.education?.length > 0) {
    score += 15;
  } else {
    suggestions.push('Add your educational background');
  }

  // Has 5+ skills
  if (resume.skills?.length >= 5) {
    score += 20;
  } else if (resume.skills?.length > 0) {
    score += 10;
    suggestions.push('Add at least 5 skills for better ATS matching');
  } else {
    suggestions.push('Add relevant skills to improve ATS matching');
  }

  // Has contact info
  const hasContact = resume.personalInfo?.email && resume.personalInfo?.phone;
  if (hasContact) {
    score += 10;
  } else {
    suggestions.push('Add both email and phone number');
  }

  // Has job title
  if (resume.personalInfo?.jobTitle) {
    score += 5;
  } else {
    suggestions.push('Add your current or target job title');
  }

  // Has projects or certifications (extra credibility)
  if (resume.projects?.length > 0 || resume.certifications?.length > 0) {
    score += 10;
  }

  return {
    score: Math.min(100, score),
    suggestions,
    grade: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Work',
  };
}

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
