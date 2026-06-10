import { Ollama } from 'ollama/browser';

import type { Message } from 'ollama/browser';
import type { ILlmApiConfig } from '@/entities/llm-api-config';
import type { ILlmGenerationConfig } from '@/entities/llm-generation-config';

export class OllamaApiClient {
  async chat(apiConfig: ILlmApiConfig, llmParameters: ILlmGenerationConfig) {
    const { selectedModelName, url } = apiConfig;
    const { promptConfigs, hyperparameters } = llmParameters;

    const messages: Array<Message> = [];

    const systemPrompt = promptConfigs.systemPrompt
      ? { role: 'system', content: promptConfigs.systemPrompt }
      : undefined;

    if (systemPrompt) {
      messages.push(systemPrompt);
    }

    const userPrompt = promptConfigs.prompt;

    const userMessage = { role: 'user', content: userPrompt };
    messages.push(userMessage);

    const ollama = new Ollama({ host: url });

    const response = await ollama.chat({
      model: selectedModelName,
      messages,
      options: hyperparameters,
    });
    console.log(response.message.content);

    return response.message.content;
  }
}
