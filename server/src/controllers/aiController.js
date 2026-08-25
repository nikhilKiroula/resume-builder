import * as aiService from '../services/aiService.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * POST /api/ai/summary
 */
export const generateSummary = async (req, res, next) => {
  try {
    const { jobTitle, yearsOfExperience, skills, existingSummary } = req.body;
    const result = await aiService.generateSummary({ jobTitle, yearsOfExperience, skills, existingSummary });
    res.status(result.success ? HTTP_STATUS.OK : HTTP_STATUS.BAD_REQUEST).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/ai/bullet-points
 */
export const generateBulletPoints = async (req, res, next) => {
  try {
    const { position, company, description, bullet } = req.body;

    let result;
    if (bullet) {
      // Improve a single bullet
      result = await aiService.improveBulletPoint({ bullet, jobTitle: position, company });
    } else {
      // Generate bullets from description
      result = await aiService.generateBulletPoints({ position, company, description });
    }

    res.status(result.success ? HTTP_STATUS.OK : HTTP_STATUS.BAD_REQUEST).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/ai/suggestions  (skill suggestions)
 */
export const getSkillSuggestions = async (req, res, next) => {
  try {
    const { jobTitle, existingSkills, experience } = req.body;
    const result = await aiService.suggestSkills({ jobTitle, existingSkills, experience });
    res.status(result.success ? HTTP_STATUS.OK : HTTP_STATUS.BAD_REQUEST).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/ai/improve  (full resume analysis)
 */
export const analyzeResume = async (req, res, next) => {
  try {
    const { personalInfo, experience, education, skills, projects } = req.body;
    const result = await aiService.analyzeResume({ personalInfo, experience, education, skills, projects });
    res.status(result.success ? HTTP_STATUS.OK : HTTP_STATUS.BAD_REQUEST).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/ai/status
 * Let the frontend know if AI is available
 */
export const getAIStatus = (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    enabled: aiService.isAIEnabled(),
    message: aiService.isAIEnabled()
      ? 'AI features are available.'
      : 'AI features are disabled. Configure AI_API_KEY in server .env to enable.',
  });
};
