import type { ILlmGenerationConfig } from '@/entities/llm-generation-config';

export interface IGenerationResult {
  model: string;
  configs: ILlmGenerationConfig;
  createdAt: Date;
  status: 'error' | 'loading' | 'ready' | 'cancelled';
  generationContentResult: string | null;
  generationThinkingResult: string | null;
  isPartial: boolean;
  // Support for Ollama function calling
  generationToolCalls: Array<{
    function: {
      name: string;
      arguments: string;
    };
  }> | null;
  doneReason?: string;
  totalDuration?: number;
  loadDuration?: number;
  promptEvalCount?: number;
  promptEvalDuration?: number;
  evalCount?: number;
  evalDuration?: number;
}
