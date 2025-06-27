'use server';

/**
 * @fileOverview Computes a match score between a resume and a job description by extracting skills/keywords and then scoring them.
 *
 * - computeMatchScore - A function that computes the match score between a resume and a job description.
 * - ComputeMatchScoreInput - The input type for the computeMatchScore function.
 * - ComputeMatchScoreOutput - The return type for the computeMatchScore function.
 */

import { ai, geminiAI, openaiAI } from '@/ai/genkit';
import { z } from 'genkit';
import { extractSkills } from './extract-skills';
import { extractKeywordsFromJobDescription } from './extract-keywords-from-jd';

const ComputeMatchScoreInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume.'),
  jobDescription: z.string().describe('The job description to match against.'),
  llmProvider: z.enum(['gemini', 'openai']).optional().default('gemini').describe('The LLM provider to use for analysis.'),
});
export type ComputeMatchScoreInput = z.infer<typeof ComputeMatchScoreInputSchema>;

const ComputeMatchScoreOutputSchema = z.object({
  matchScore: z
    .number()
    .describe('The match score between the resume and job description (0-100).'),
  topMatchedSkills: z
    .array(z.string())
    .describe('The top 3 matched skills/keywords.'),
});
export type ComputeMatchScoreOutput = z.infer<typeof ComputeMatchScoreOutputSchema>;

export async function computeMatchScore(input: ComputeMatchScoreInput): Promise<ComputeMatchScoreOutput> {
  return computeMatchScoreFlow(input);
}

const ScoringInputSchema = z.object({
  resumeSkills: z.array(z.string()).describe("A list of skills extracted from the resume."),
  jobKeywords: z.array(z.string()).describe("A list of keywords extracted from the job description."),
  jobDescription: z.string().describe("The full job description for context."),
});

const computeMatchScoreFlow = ai.defineFlow(
  {
    name: 'computeMatchScoreFlow',
    inputSchema: ComputeMatchScoreInputSchema,
    outputSchema: ComputeMatchScoreOutputSchema,
  },
  async (input) => {
    // Select the appropriate AI instance based on the provider
    const selectedAI = input.llmProvider === 'openai' ? openaiAI : geminiAI;

    const scoringPrompt = selectedAI.definePrompt({
      name: 'scoringPrompt',
      input: { schema: ScoringInputSchema },
      output: { schema: ComputeMatchScoreOutputSchema },
      prompt: `You are an expert AI recruiting assistant. Your task is to calculate a match score between a candidate's skills and the keywords from a job description.

        Job Description for context:
        ---
        {{{jobDescription}}}
        ---

        Candidate's Skills:
        {{#each resumeSkills}}
        - {{{this}}}
        {{/each}}

        Job Keywords:
        {{#each jobKeywords}}
        - {{{this}}}
        {{/each}}

        Analyze the candidate's skills against the job keywords and the overall job description.
        - Consider direct matches and semantic similarities. For example, "ReactJS" is a strong match for "React". "Web Development" is related to "HTML" and "CSS".
        - A UI/UX designer's skills like "Figma", "Sketch", "User Research", and "Wireframing" are highly relevant for a "UI/UX Designer" role, even if the exact words don't match the keywords perfectly. Pay close attention to the job title and core responsibilities in the full job description.
        - Based on this analysis, calculate a \`matchScore\` from 0 to 100. A score of 0 means no relevance. A score of 100 is a perfect fit.
        - Identify the \`topMatchedSkills\`, which are the top 3 most relevant skills from the candidate's list that match the job requirements.
        - Return the result in the specified JSON format.
        `,
    });

    // Step 1: Extract skills and keywords explicitly.
    const [skillsResult, keywordsResult] = await Promise.all([
      extractSkills({ resumeText: input.resumeText, llmProvider: input.llmProvider }),
      extractKeywordsFromJobDescription({ jobDescription: input.jobDescription, llmProvider: input.llmProvider }),
    ]);

    const skills = skillsResult?.skills || [];
    const keywords = keywordsResult?.keywords || [];

    // If no skills are found in the resume, it's impossible to match.
    if (skills.length === 0) {
      return {
        matchScore: 0,
        topMatchedSkills: [],
      };
    }

    // Step 2: Pass the extracted lists to a focused prompt for scoring.
    const { output } = await scoringPrompt({
      resumeSkills: skills,
      jobKeywords: keywords,
      jobDescription: input.jobDescription,
    });

    if (!output) {
      throw new Error("The AI model failed to generate a score.");
    }

    return output;
  }
);
