export interface IOllamaGenerationHyperparameters {
  num_ctx: number;
  num_predict: number;
  temperature: number;
  top_k: number;
  top_p: number;
  min_p: number;
  seed?: number;
  presence_penalty: number;
  repeat_last_n?: number;
  frequency_penalty?: number;
  mirostat?: number;
  mirostat_tau?: number;
  mirostat_eta?: number;
  num_keep?: number;
  tfs_z?: number;
  typical_p?: number;
  num_thread?: number;
}

export interface IPromptVariant {
  id: string;
  systemPrompt: string | null;
  prompt: string;
  isEditing: boolean;
}

export interface IGenerationPrompts {
  systemPrompt: string | null;
  prompt: string;
  promptVariants: Array<IPromptVariant>;
}

export interface ILlmGenerationConfig {
  promptConfigs: IGenerationPrompts;
  hyperparameters: IOllamaGenerationHyperparameters;
}
