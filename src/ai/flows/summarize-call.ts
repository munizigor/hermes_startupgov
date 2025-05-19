// Summarize the key details of the call transcript using AI.
'use server';

/**
 * @fileOverview Summarizes the key details of a call transcript using AI.
 *
 * - summarizeCall - A function that handles the summarization of a call transcript.
 * - SummarizeCallInput - The input type for the summarizeCall function.
 * - SummarizeCallOutput - The return type for the summarizeCall function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCallInputSchema = z.object({
  transcript: z
    .string()
    .describe('The transcript of the call to be summarized.'),
});
export type SummarizeCallInput = z.infer<typeof SummarizeCallInputSchema>;

const SummarizeCallOutputSchema = z.object({
  summary: z.string().describe('A summary of the key details of the call.'),
});
export type SummarizeCallOutput = z.infer<typeof SummarizeCallOutputSchema>;

export async function summarizeCall(input: SummarizeCallInput): Promise<SummarizeCallOutput> {
  return summarizeCallFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCallPrompt',
  input: {schema: SummarizeCallInputSchema},
  output: {schema: SummarizeCallOutputSchema},
  prompt: `You are an expert dispatcher. Please summarize the key details of the following call transcript. Be concise and focus on the most important information for dispatchers reviewing past incidents.\n\nTranscript: {{{transcript}}}`,
});

const summarizeCallFlow = ai.defineFlow(
  {
    name: 'summarizeCallFlow',
    inputSchema: SummarizeCallInputSchema,
    outputSchema: SummarizeCallOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
