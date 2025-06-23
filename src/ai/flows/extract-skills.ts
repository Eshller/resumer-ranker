// src/ai/flows/extract-skills.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for extracting skills from a resume.
 *
 * - extractSkills - A function that extracts skills from a resume.
 * - ExtractSkillsInput - The input type for the extractSkills function.
 * - ExtractSkillsOutput - The return type for the extractSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractSkillsInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume from which skills need to be extracted.'),
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

const extractSkillsPrompt = ai.definePrompt({
  name: 'extractSkillsPrompt',
  input: {schema: ExtractSkillsInputSchema},
  output: {schema: ExtractSkillsOutputSchema},
  prompt: `You are an AI expert in parsing resumes and identifying technical skills.

  Given the following resume text, extract all relevant skills, especially technical skills like programming languages, software tools, and technologies.  Return a simple array of strings, with no additional commentary.

  Resume Text:
  {{resumeText}}`,
});

const extractSkillsFlow = ai.defineFlow(
  {
    name: 'extractSkillsFlow',
    inputSchema: ExtractSkillsInputSchema,
    outputSchema: ExtractSkillsOutputSchema,
  },
  async input => {
    const {output} = await extractSkillsPrompt(input);
    return output!;
  }
);
