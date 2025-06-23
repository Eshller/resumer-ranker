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

const extractKeywordsTool = ai.defineTool({
  name: 'extractKeywords',
  description: 'Extracts keywords from a given text.',
  inputSchema: z.object({
    text: z.string().describe('The text to extract keywords from.'),
  }),
  outputSchema: z.array(z.string()).describe('An array of keywords extracted from the text.'),
}, async (input) => {
  const {text} = input;
  // Dummy implementation for keyword extraction - replace with actual logic
  return text.split(/\s+/).slice(0, 5); // Returns first 5 words as keywords
});


const computeSimilarityPrompt = ai.definePrompt({
  name: 'computeSimilarityPrompt',
  tools: [extractKeywordsTool],
  input: {schema: ComputeMatchScoreInputSchema},
  output: {schema: ComputeMatchScoreOutputSchema},
  prompt: `You are an AI resume screener. Compute a match score between the resume and job description provided. 

  First, use the extractKeywords tool to extract keywords from both the resume and the job description.
  Second, compute a match score (0-100) based on the overlap of skills and keywords between the resume and the job description. 
  Consider semantic similarity and keyword matching.
  Third, identify the top 3 matched skills/keywords from the resume that are most relevant to the job description.

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
    return output!;
  }
);
