// src/ai/flows/extract-keywords-from-jd.ts
'use server';
/**
 * @fileOverview Extracts keywords from a job description using GenAI.
 *
 * - extractKeywordsFromJobDescription - A function that extracts keywords from a job description.
 * - ExtractKeywordsFromJobDescriptionInput - The input type for the extractKeywordsFromJobDescription function.
 * - ExtractKeywordsFromJobDescriptionOutput - The return type for the extractKeywordsFromJobDescription function.
 */

import { ai, geminiAI, openaiAI } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractKeywordsFromJobDescriptionInputSchema = z.object({
  jobDescription: z.string().describe('The job description to extract keywords from.'),
  llmProvider: z.enum(['gemini', 'openai']).optional().default('gemini').describe('The LLM provider to use for analysis.'),
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

const extractKeywordsFromJobDescriptionFlow = ai.defineFlow(
  {
    name: 'extractKeywordsFromJobDescriptionFlow',
    inputSchema: ExtractKeywordsFromJobDescriptionInputSchema,
    outputSchema: ExtractKeywordsFromJobDescriptionOutputSchema,
  },
  async input => {
    // Select the appropriate AI instance based on the provider
    const selectedAI = input.llmProvider === 'openai' ? openaiAI : geminiAI;

    const prompt = selectedAI.definePrompt({
      name: 'extractKeywordsFromJobDescriptionPrompt',
      input: { schema: ExtractKeywordsFromJobDescriptionInputSchema },
      output: { schema: ExtractKeywordsFromJobDescriptionOutputSchema },
      prompt: `You are an expert recruiter who is able to extract keywords from a job description.

      Extract keywords from the following job description:

      {{jobDescription}}

      Return the keywords as a list of strings.
      `,
    });

    const { output } = await prompt(input);
    return output!;
  }
);
