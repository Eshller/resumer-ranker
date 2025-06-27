import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { openAI } from 'genkitx-openai';

export const ai = genkit({
  plugins: [googleAI(), openAI()],
  model: 'googleai/gemini-2.0-flash', // Default model
});

// Export individual AI instances for specific model selection
export const geminiAI = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});

export const openaiAI = genkit({
  plugins: [openAI()],
  model: 'openai/gpt-4o',
});
