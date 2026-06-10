import type { IOllamaGenerationHyperparameters } from '@/entities/llm-generation-config';
import type { ILlmParameter } from '@/entities/llm-parameter';

export function mapLlmParametersToApiOptions(llmParameters: Array<ILlmParameter>) {
  const config: Record<string, number> = {};

  for (const param of llmParameters) {
    config[param.name] = param.value;
  }

  return config as unknown as IOllamaGenerationHyperparameters;
}
