import { config } from 'dotenv';
config();

import '@/ai/flows/compute-match-score.ts';
import '@/ai/flows/extract-skills.ts';
import '@/ai/flows/extract-keywords-from-jd.ts';