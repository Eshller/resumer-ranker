// src/ai/flows/extract-skills.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for extracting skills from a resume.
 *
 * - extractSkills - A function that extracts skills from a resume.
 * - ExtractSkillsInput - The input type for the extractSkills function.
 * - ExtractSkillsOutput - The return type for the extractSkills function.
 */

import { ai, geminiAI, openaiAI } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractSkillsInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume from which skills need to be extracted.'),
  llmProvider: z.enum(['gemini', 'openai']).optional().default('gemini').describe('The LLM provider to use for analysis.'),
});
export type ExtractSkillsInput = z.infer<typeof ExtractSkillsInputSchema>;

const ExtractSkillsOutputSchema = z.object({
  skills: z
    .array(z.string())
    .describe('A list of skills extracted from the resume.'),
});
export type ExtractSkillsOutput = z.infer<typeof ExtractSkillsOutputSchema>;

export async function extractSkills(input: ExtractSkillsInput): Promise<ExtractSkillsOutput> {
  return extractSkillsFlow(input);
}

const extractSkillsFlow = ai.defineFlow(
  {
    name: 'extractSkillsFlow',
    inputSchema: ExtractSkillsInputSchema,
    outputSchema: ExtractSkillsOutputSchema,
  },
  async input => {
    // Select the appropriate AI instance based on the provider
    const selectedAI = input.llmProvider === 'openai' ? openaiAI : geminiAI;

    const extractSkillsPrompt = selectedAI.definePrompt({
      name: 'extractSkillsPrompt',
      input: { schema: ExtractSkillsInputSchema },
      output: { schema: ExtractSkillsOutputSchema },
      prompt: `You are an AI expert in parsing resumes. Given the following resume text, extract all relevant professional skills. This includes technical skills (e.g., programming languages, software), design skills (e.g., Figma, Sketch, UI/UX), and other relevant abilities. Return a simple array of strings, with no additional commentary.

      Resume Text:
      {{resumeText}}`,
    });

    const { output } = await extractSkillsPrompt(input);
    return output!;
  }
);
