import type { ILlmGenerationConfig } from '@/entities/llm-generation-config';

export interface IGenerationResult {
  model: string;
  configs: ILlmGenerationConfig;
  createdAt: Date;
  status: 'error' | 'loading' | 'ready';
  generationContentResult: string | null;
  generationThinkingResult: string | null;
  doneReason?: string;
  totalDuration?: number;
  loadDuration?: number;
  promptEvalCount?: number;
  promptEvalDuration?: number;
  evalCount?: number;
  evalDuration?: number;
}
