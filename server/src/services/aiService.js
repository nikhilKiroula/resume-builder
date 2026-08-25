/**
 * AI Service — abstracted layer for AI-powered resume features.
 *
 * Provider: OpenAI-compatible API (configurable via env vars).
 * Gracefully disables all AI features if AI_API_KEY is not set,
 * returning a helpful message instead of crashing.
 *
 * To enable: set AI_API_KEY in your .env file.
 * Compatible with: OpenAI, Groq, Together AI, Mistral, or any
 * OpenAI-compatible provider by changing AI_BASE_URL.
 */
import { createRequire } from 'module';

export const isAIEnabled = () => Boolean(process.env.AI_API_KEY?.trim());

const AI_DISABLED_RESPONSE = {
  success: false,
  message: 'AI features are not configured. Add your AI_API_KEY to the server .env file to enable them.',
  aiDisabled: true,
};

/**
 * Build an OpenAI-compatible client lazily (only when a key exists).
 * We use dynamic import() for ESM compatibility.
 */
let openaiClient = null;
const getClient = async () => {
  if (!isAIEnabled()) return null;
  if (openaiClient) return openaiClient;

  const { OpenAI } = await import('openai');
  openaiClient = new OpenAI({
    apiKey: process.env.AI_API_KEY,
    baseURL: process.env.AI_BASE_URL || 'https://api.openai.com/v1',
  });
  return openaiClient;
};

const MODEL = () => process.env.AI_MODEL || 'gpt-3.5-turbo';

/**
 * Core completion call with error handling
 */
const complete = async (messages, maxTokens = 500) => {
  const client = await getClient();
  const response = await client.chat.completions.create({
    model: MODEL(),
    messages,
    max_tokens: maxTokens,
    temperature: 0.7,
  });
  return response.choices[0]?.message?.content?.trim() || '';
};

// ─── Feature Functions ─────────────────────────────────────────────────────────

/**
 * Generate a professional resume summary
 */
export const generateSummary = async ({ jobTitle, yearsOfExperience, skills, existingSummary }) => {
  if (!isAIEnabled()) return AI_DISABLED_RESPONSE;

  try {
    const prompt = `You are a professional resume writer. Generate a concise, compelling 3-4 sentence professional summary for a resume.

Job Title: ${jobTitle || 'Professional'}
Years of Experience: ${yearsOfExperience || 'Not specified'}
Key Skills: ${skills?.join(', ') || 'Not specified'}
${existingSummary ? `Existing Summary (improve this): ${existingSummary}` : ''}

Rules:
- Write in first person without "I"
- Be specific and achievement-oriented
- Do NOT invent companies, metrics, or technologies not mentioned
- Keep it under 100 words
- Make it ATS-friendly
- Return ONLY the summary text, no labels or extra formatting`;

    const summary = await complete([{ role: 'user', content: prompt }], 300);
    return { success: true, summary };
  } catch (error) {
    return { success: false, message: `AI error: ${error.message}` };
  }
};

/**
 * Improve a bullet point to be more impactful
 */
export const improveBulletPoint = async ({ bullet, jobTitle, company }) => {
  if (!isAIEnabled()) return AI_DISABLED_RESPONSE;

  try {
    const prompt = `You are a professional resume writer. Improve the following resume bullet point to be more impactful and professional.

Original bullet: "${bullet}"
Job Title: ${jobTitle || 'Not specified'}
Company: ${company || 'Not specified'}

Rules:
- Start with a strong action verb
- Be specific about what was done
- Do NOT add fake metrics, team sizes, percentages, or technologies not implied in the original
- Keep it to one sentence
- Make it ATS-friendly
- Return ONLY the improved bullet point, no labels or extra text`;

    const improved = await complete([{ role: 'user', content: prompt }], 150);
    return { success: true, improved };
  } catch (error) {
    return { success: false, message: `AI error: ${error.message}` };
  }
};

/**
 * Generate multiple bullet points for a job experience
 */
export const generateBulletPoints = async ({ position, company, description }) => {
  if (!isAIEnabled()) return AI_DISABLED_RESPONSE;

  try {
    const prompt = `You are a professional resume writer. Generate 3-4 strong resume bullet points based on the following job information.

Position: ${position || 'Professional'}
Company: ${company || 'Not specified'}
Description/Context: "${description || ''}"

Rules:
- Each bullet starts with a strong action verb
- Do NOT invent specific metrics, team sizes, percentages, or tools not mentioned in the description
- Base bullets strictly on what is described
- Make them specific and results-oriented where context allows
- Return ONLY the bullet points, one per line, starting with "•"`;

    const result = await complete([{ role: 'user', content: prompt }], 400);
    const bullets = result
      .split('\n')
      .filter((line) => line.trim().startsWith('•') || line.trim().startsWith('-'))
      .map((line) => line.replace(/^[•\-]\s*/, '').trim())
      .filter(Boolean);

    return { success: true, bullets };
  } catch (error) {
    return { success: false, message: `AI error: ${error.message}` };
  }
};

/**
 * Suggest relevant skills based on resume content
 */
export const suggestSkills = async ({ jobTitle, existingSkills, experience }) => {
  if (!isAIEnabled()) return AI_DISABLED_RESPONSE;

  try {
    const existingStr = existingSkills?.map((s) => s.name).join(', ') || '';
    const expStr = experience
      ?.map((e) => `${e.position} at ${e.company}: ${e.description || ''}`)
      .join('; ') || '';

    const prompt = `You are a resume expert. Suggest 5-8 relevant skills for this professional's resume.

Job Title: ${jobTitle || 'Professional'}
Current Skills: ${existingStr || 'None listed'}
Experience Context: ${expStr || 'Not provided'}

Rules:
- Only suggest skills that are genuinely relevant to the job title and experience described
- Do NOT suggest skills that are completely unrelated
- Do NOT repeat skills they already have
- Return ONLY a JSON array of skill names, e.g. ["React", "Node.js", "MongoDB"]`;

    const result = await complete([{ role: 'user', content: prompt }], 200);
    let suggestions = [];
    try {
      const match = result.match(/\[[\s\S]*\]/);
      suggestions = match ? JSON.parse(match[0]) : [];
    } catch {
      suggestions = result
        .split('\n')
        .map((s) => s.replace(/^[-•*"]\s*/, '').trim())
        .filter(Boolean)
        .slice(0, 8);
    }

    return { success: true, suggestions };
  } catch (error) {
    return { success: false, message: `AI error: ${error.message}` };
  }
};

/**
 * Analyze resume and provide improvement feedback
 */
export const analyzeResume = async ({ personalInfo, experience, education, skills, projects }) => {
  if (!isAIEnabled()) return AI_DISABLED_RESPONSE;

  try {
    const resumeText = JSON.stringify({
      name: personalInfo?.fullName,
      title: personalInfo?.jobTitle,
      summary: personalInfo?.summary?.substring(0, 200),
      experienceCount: experience?.length || 0,
      educationCount: education?.length || 0,
      skillCount: skills?.length || 0,
      projectCount: projects?.length || 0,
    });

    const prompt = `You are an expert ATS resume reviewer. Analyze this resume data and provide actionable feedback.

Resume data: ${resumeText}

Provide feedback as a JSON object with this structure:
{
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "atsIssues": ["issue1", "issue2"],
  "overallFeedback": "2-3 sentence overall assessment"
}

Be specific, constructive, and practical. Return ONLY valid JSON.`;

    const result = await complete([{ role: 'user', content: prompt }], 600);
    let feedback;
    try {
      const match = result.match(/\{[\s\S]*\}/);
      feedback = match ? JSON.parse(match[0]) : null;
    } catch {
      feedback = null;
    }

    if (!feedback) {
      return { success: false, message: 'Could not parse AI response. Please try again.' };
    }

    return { success: true, feedback };
  } catch (error) {
    return { success: false, message: `AI error: ${error.message}` };
  }
};
