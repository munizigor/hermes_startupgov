'use server';

/**
 * @fileOverview Classifies emergency calls as either 'Ocorrência' or 'Incidente',
 * determining the type of dispatch needed and extracting key details from the call transcript.
 *
 * - classifyCall - A function that classifies the call and extracts relevant information.
 * - ClassifyCallInput - The input type for the classifyCall function.
 * - ClassifyCallOutput - The return type for the classifyCall function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyCallInputSchema = z.object({
  transcript: z
    .string()
    .describe('The transcript of the emergency call.'),
});
export type ClassifyCallInput = z.infer<typeof ClassifyCallInputSchema>;

const ClassifyCallOutputSchema = z.object({
  classification: z.enum(['Ocorrência', 'Incidente']).describe('The classification of the call.'),
  dispatchType: z.string().optional().describe('The type of dispatch needed, if applicable.'),
  callerName: z.string().optional().describe("The caller's name."),
  callerPhoneNumber: z.string().optional().describe("The caller's phone number."),
  address: z.string().optional().describe('The address of the incident.'),
  city: z.string().optional().describe('The city of the incident.'),
});
export type ClassifyCallOutput = z.infer<typeof ClassifyCallOutputSchema>;

export async function classifyCall(input: ClassifyCallInput): Promise<ClassifyCallOutput> {
  return classifyCallFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyCallPrompt',
  input: {schema: ClassifyCallInputSchema},
  output: {schema: ClassifyCallOutputSchema},
  prompt: `You are an expert emergency call classifier. Your task is to analyze the provided call transcript and classify the nature of the call as either an 'Ocorrência' (Occurrence) or 'Incidente' (Incident).

  Based on the transcript, determine if a dispatch is needed. If so, specify the type of dispatch required (e.g., 'Firetruck', 'Ambulance', 'Police').

  Additionally, extract the caller's name, phone number, and address details from the transcript. If the city is mentioned, extract that as well. If any piece of information is unavailable, leave the corresponding output field blank

  Here is the call transcript:
  {{transcript}}

  Classify the call and extract the details according to the following schema:
  ${JSON.stringify(ClassifyCallOutputSchema.describe, null, 2)}`,
});

const classifyCallFlow = ai.defineFlow(
  {
    name: 'classifyCallFlow',
    inputSchema: ClassifyCallInputSchema,
    outputSchema: ClassifyCallOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
