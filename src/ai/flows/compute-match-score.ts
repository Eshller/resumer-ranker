'use server';

/**
 * @fileOverview Computes a match score between a resume and a job description using semantic similarity and keyword matching.
 *
 * - computeMatchScore - A function that computes the match score between a resume and a job description.
 * - ComputeMatchScoreInput - The input type for the computeMatchScore function.
 * - ComputeMatchScoreOutput - The return type for the computeMatchScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { extractSkills } from './extract-skills';
import { extractKeywordsFromJobDescription } from './extract-keywords-from-jd';

const ComputeMatchScoreInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume.'),
  jobDescription: z.string().describe('The job description to match against.'),
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


// Tool definitions
const extractSkillsTool = ai.defineTool(
  {
    name: 'extractSkillsFromResume',
    description: 'Extracts a list of skills from a resume text.',
    inputSchema: z.object({ resumeText: z.string() }),
    outputSchema: z.object({ skills: z.array(z.string()) }),
  },
  async ({ resumeText }) => extractSkills({ resumeText })
);

const extractKeywordsTool = ai.defineTool(
  {
    name: 'extractKeywordsFromJobDescription',
    description: 'Extracts a list of keywords from a job description.',
    inputSchema: z.object({ jobDescription: z.string() }),
    outputSchema: z.object({ keywords: z.array(z.string()) }),
  },
  async ({ jobDescription }) => extractKeywordsFromJobDescription({ jobDescription })
);


// Tool-based prompt
const toolBasedPrompt = ai.definePrompt({
  name: 'toolBasedMatchPrompt',
  tools: [extractSkillsTool, extractKeywordsTool],
  input: { schema: ComputeMatchScoreInputSchema },
  output: { schema: ComputeMatchScoreOutputSchema },
  system: `You are an AI resume screener. Your task is to compute a match score between a resume and a job description.
1. Use the \`extractSkillsFromResume\` tool to get skills from the resume.
2. Use the \`extractKeywordsFromJobDescription\` tool to get keywords from the job description.
3. Compare the lists of skills and keywords.
4. Calculate a \`matchScore\` from 0 to 100 based on the overlap and relevance of the skills to the job requirements.
5. Identify the \`topMatchedSkills\`, which should be the top 3 skills from the resume that are most relevant to the job description.
6. Return the final result in the required JSON format.`,
  prompt: `Resume: {{{resumeText}}}\n\nJob Description: {{{jobDescription}}}`,
});

// Fallback prompt (no tools)
const fallbackPrompt = ai.definePrompt({
  name: 'fallbackMatchPrompt',
  input: {schema: ComputeMatchScoreInputSchema},
  output: {schema: ComputeMatchScoreOutputSchema},
  prompt: `You are an AI resume screener. Your task is to compute a match score between the provided resume and job description.

  Analyze the resume text and the job description to determine how well the candidate's skills and experience align with the job requirements.

  Based on your analysis, provide a match score from 0 to 100, where 100 is a perfect match. Also, identify the top 3 skills or keywords from the resume that are most relevant to the job description.

  Consider semantic similarity, keyword overlap, and overall fit.

  Resume: {{{resumeText}}}
  Job Description: {{{jobDescription}}}

  Return the match score and top matched skills in the format specified in the output schema.
`,
});


const computeMatchScoreFlow = ai.defineFlow(
  {
    name: 'computeMatchScoreFlow',
    inputSchema: ComputeMatchScoreInputSchema,
    outputSchema: ComputeMatchScoreOutputSchema,
  },
  async input => {
    try {
      const {output} = await toolBasedPrompt(input);
      if (output) {
        return output;
      }
    } catch (e) {
      // Log the error and proceed to fallback
      console.warn('Tool-based prompt failed, proceeding to fallback.', e);
    }
    
    // Fallback to a simpler prompt if the tool-based one fails
    const {output} = await fallbackPrompt(input);
    if (!output) {
      throw new Error("The AI model failed to return a valid result, even after fallback.");
    }
    return output;
  }
);
