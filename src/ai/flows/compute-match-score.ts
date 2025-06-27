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

const computeSimilarityPrompt = ai.definePrompt({
  name: 'computeSimilarityPrompt',
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
    const {output} = await computeSimilarityPrompt(input);
    if (!output) {
      throw new Error("The AI model failed to return a valid result.");
    }
    return output;
  }
);
