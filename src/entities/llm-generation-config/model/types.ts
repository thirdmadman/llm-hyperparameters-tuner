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

export interface ILlmGenerationConfig {
  promptConfigs: IGenerationPrompts;
  hyperparameters: IOllamaGenerationHyperparameters;
}
