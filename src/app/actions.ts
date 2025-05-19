// src/app/actions.ts
"use server";

import { classifyCall, type ClassifyCallInput, type ClassifyCallOutput } from "@/ai/flows/classify-call";
import { summarizeCall, type SummarizeCallInput, type SummarizeCallOutput } from "@/ai/flows/summarize-call";

export async function handleClassifyCallAction(input: ClassifyCallInput): Promise<ClassifyCallOutput> {
  try {
    const result = await classifyCall(input);
    return result;
  } catch (error) {
    console.error("Error in handleClassifyCallAction:", error);
    // It's better to return a structured error or rethrow a custom error
    // For simplicity, rethrowing a generic error here.
    // In a real app, you might want to sanitize the error or return a specific error object.
    throw new Error(`Failed to classify call. Details: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function handleSummarizeCallAction(input: SummarizeCallInput): Promise<SummarizeCallOutput> {
  try {
    const result = await summarizeCall(input);
    return result;
  } catch (error) {
    console.error("Error in handleSummarizeCallAction:", error);
    throw new Error(`Failed to summarize call. Details: ${error instanceof Error ? error.message : String(error)}`);
  }
}
