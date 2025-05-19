import type { ClassifyCallOutput } from "@/ai/flows/classify-call";

export interface CallRecord extends ClassifyCallOutput {
  id: string;
  date: string; // ISO string format
  transcript: string;
  summary?: string;
}

export type CallNature = "Ocorrência" | "Incidente";
