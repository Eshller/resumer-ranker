// src/ai/flows/extract-keywords-from-jd.ts
'use server';
/**
 * @fileOverview Extracts keywords from a job description using GenAI.
 *
 * - extractKeywordsFromJobDescription - A function that extracts keywords from a job description.
 * - ExtractKeywordsFromJobDescriptionInput - The input type for the extractKeywordsFromJobDescription function.
 * - ExtractKeywordsFromJobDescriptionOutput - The return type for the extractKeywordsFromJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractKeywordsFromJobDescriptionInputSchema = z.object({
  jobDescription: z.string().describe('The job description to extract keywords from.'),
});
export type ExtractKeywordsFromJobDescriptionInput = z.infer<typeof ExtractKeywordsFromJobDescriptionInputSchema>;

const ExtractKeywordsFromJobDescriptionOutputSchema = z.object({
  keywords: z.array(z.string()).describe('The keywords extracted from the job description.'),
});
export type ExtractKeywordsFromJobDescriptionOutput = z.infer<typeof ExtractKeywordsFromJobDescriptionOutputSchema>;

export async function extractKeywordsFromJobDescription(
  input: ExtractKeywordsFromJobDescriptionInput
): Promise<ExtractKeywordsFromJobDescriptionOutput> {
  return extractKeywordsFromJobDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractKeywordsFromJobDescriptionPrompt',
  input: {schema: ExtractKeywordsFromJobDescriptionInputSchema},
  output: {schema: ExtractKeywordsFromJobDescriptionOutputSchema},
  prompt: `You are an expert recruiter who is able to extract keywords from a job description.

  Extract keywords from the following job description:

  {{jobDescription}}

  Return the keywords as a list of strings.
  `,
});

const extractKeywordsFromJobDescriptionFlow = ai.defineFlow(
  {
    name: 'extractKeywordsFromJobDescriptionFlow',
    inputSchema: ExtractKeywordsFromJobDescriptionInputSchema,
    outputSchema: ExtractKeywordsFromJobDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
