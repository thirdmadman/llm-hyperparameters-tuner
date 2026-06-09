export interface ILlmParameter {
  label: string;
  name: string;
  value: number;
  min: number;
  max: number;
  isVariable: boolean;
  startVariateFrom: number | null;
  endVariateTo: number | null;
  stepsCount: number | null;
}

export interface ILlmApiConfig {
  url: string;
  selectedModelName: string;
}

export interface IOllamaGenerationHyperparameters {
  num_ctx: number;
  max_tokens: number;
  min_p: number;
  top_k: number;
  top_p: number;
  presence_penalty: number;
}

export interface IGenerationPrompts {
  systemPrompt: string | null;
  prompt: string;
}

export interface IGenerationConfigs {
  promptConfigs: IGenerationPrompts;
  hyperparameters: IOllamaGenerationHyperparameters;
}
export interface IGenerationResult {
  model: string;
  configs: IGenerationConfigs;
  createdAt: string;
  status: 'error' | 'loading' | 'ready';
  generationOutputResult: string | null;
  doneReason?: string;
  totalDuration?: number;
  loadDuration?: number;
  promptEvalCount?: number;
  promptEvalDuration?: number;
  evalCount?: number;
  evalDuration?: number;
}
