import Resume from '../models/Resume.js';
import { HTTP_STATUS, DEFAULT_SECTION_ORDER, DEFAULT_CUSTOMIZATION } from '../constants/index.js';
import { nanoid } from 'nanoid';

/**
 * GET /api/resumes
 * List all resumes for the authenticated user
 */
export const getResumes = async (req, res, next) => {
  try {
    const { search, sort = 'updatedAt', order = 'desc', template } = req.query;

    const query = { userId: req.user._id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'personalInfo.fullName': { $regex: search, $options: 'i' } },
        { 'personalInfo.jobTitle': { $regex: search, $options: 'i' } },
      ];
    }
    if (template) query.selectedTemplate = template;

    const sortObj = { [sort]: order === 'asc' ? 1 : -1 };

    const resumes = await Resume.find(query)
      .sort(sortObj)
      .select('title selectedTemplate personalInfo customization isPublic publicSlug updatedAt createdAt sectionOrder');

    const withScores = resumes.map((r) => r.toJSON());

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: resumes.length,
      resumes: withScores,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/resumes
 * Create a new resume
 */
export const createResume = async (req, res, next) => {
  try {
    const { title = 'My Resume', selectedTemplate = 'modern' } = req.body;

    const generatedSlug = `resume-${Date.now()}`;
    const resume = await Resume.create({
      userId: req.user._id,
      title,
      publicSlug: generatedSlug,
      selectedTemplate,
      sectionOrder: [...DEFAULT_SECTION_ORDER],
      customization: { ...DEFAULT_CUSTOMIZATION },
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Resume created successfully.',
      resume,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/resumes/:id
 * Get a single resume (owner only)
 */
export const getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Resume not found.',
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      resume,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/resumes/:id
 * Update a resume (owner only)
 */
export const updateResume = async (req, res, next) => {
  try {
    // Prevent changing ownership
    delete req.body.userId;
    delete req.body.publicSlug;

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Resume not found.',
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Resume saved.',
      resume,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/resumes/:id
 * Delete a resume (owner only)
 */
export const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Resume not found.',
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Resume deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/resumes/:id/duplicate
 * Duplicate a resume (owner only)
 */
export const duplicateResume = async (req, res, next) => {
  try {
    const original = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!original) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Resume not found.',
      });
    }

    const duplicateData = original.toObject();
    delete duplicateData._id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;
    delete duplicateData.__v;
    duplicateData.title = `${original.title} (Copy)`;
    duplicateData.isPublic = false;
    duplicateData.publicSlug = null;

    const cleanArray = (arr) =>
      arr?.map((item) => {
        const { _id, ...rest } = item.toObject ? item.toObject() : item;
        return rest;
      }) || [];

    duplicateData.experience = cleanArray(original.experience);
    duplicateData.education = cleanArray(original.education);
    duplicateData.skills = cleanArray(original.skills);
    duplicateData.projects = cleanArray(original.projects);
    duplicateData.certifications = cleanArray(original.certifications);
    duplicateData.achievements = cleanArray(original.achievements);
    duplicateData.languages = cleanArray(original.languages);

    const duplicate = await Resume.create(duplicateData);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Resume duplicated successfully.',
      resume: duplicate,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/resumes/:id/public
 * Toggle public/private and generate slug
 */
export const togglePublic = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Resume not found.',
      });
    }

    resume.isPublic = !resume.isPublic;

    // Generate slug when making public for the first time
    if (resume.isPublic && !resume.publicSlug) {
      let slug;
      let isUnique = false;
      while (!isUnique) {
        slug = nanoid(10);
        const existing = await Resume.findOne({ publicSlug: slug });
        if (!existing) isUnique = true;
      }
      resume.publicSlug = slug;
    }

    await resume.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: resume.isPublic ? 'Resume is now public.' : 'Resume is now private.',
      isPublic: resume.isPublic,
      publicSlug: resume.publicSlug,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/resumes/public/:slug
 * View a public resume — no authentication required
 */
export const getPublicResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      publicSlug: req.params.slug,
      isPublic: true,
    }).select('-userId');

    if (!resume) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Resume not found or is private.',
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      resume,
    });
  } catch (error) {
    next(error);
  }
};
