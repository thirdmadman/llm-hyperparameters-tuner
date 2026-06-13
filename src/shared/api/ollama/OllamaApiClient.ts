import { Ollama } from 'ollama/browser';

import type { ChatResponse, Message } from 'ollama/browser';
import type { ILlmApiConfig } from '@/entities/llm-api-config';
import type { ILlmGenerationConfig } from '@/entities/llm-generation-config';

export class OllamaApiClient {
  private client: Ollama;

  constructor(apiConfig?: ILlmApiConfig) {
    const host = apiConfig?.url ?? 'http://127.0.0.1:11434';
    this.client = new Ollama({ host });
  }

  /**
   * Abort ALL active streams on this client instance.
   * Each stream's `for await` loop will throw an AbortError.
   */
  abort() {
    this.client.abort();
  }

  /**
   * Streaming chat that calls `onChunk` with each accumulated result.
   * Returns the final `ChatResponse` when the stream completes (or throws AbortError).
   */
  async streamChat(
    apiConfig: ILlmApiConfig,
    llmParameters: ILlmGenerationConfig,
    onChunk: (accumulatedContent: string | null, accumulatedThinking: string | null) => void
  ) {
    const { selectedModelName } = apiConfig;
    const { hyperparameters } = llmParameters;

    const messages: Array<Message> = [];
    if (llmParameters.promptConfigs.systemPrompt) {
      messages.push({ role: 'system', content: llmParameters.promptConfigs.systemPrompt });
    }
    messages.push({ role: 'user', content: llmParameters.promptConfigs.prompt });

    const stream = await this.client.chat({
      model: selectedModelName,
      messages,
      options: hyperparameters,
      stream: true, // required for cancellation support
    });

    let accumulatedContent: string | null = null;
    let accumulatedThinking: string | null = null;
    let finalResponse: ChatResponse | undefined;

    try {
      for await (const chunk of stream) {
        if (chunk.message.content) {
          accumulatedContent =
            accumulatedContent === null ? chunk.message.content : accumulatedContent + chunk.message.content;
        }

        if (chunk.message.thinking) {
          accumulatedThinking =
            accumulatedThinking === null ? chunk.message.thinking : accumulatedThinking + chunk.message.thinking;
        }

        // Notify subscriber of current accumulation state
        onChunk(accumulatedContent, accumulatedThinking);

        if (chunk.done) {
          finalResponse = { ...chunk };
        }
      }
    } catch (err: unknown) {
      // AbortError is expected when client.abort() is called externally
      if ((err as Error).name === 'AbortError') {
        // Re-throw so caller knows this stream was cancelled
        throw err;
      }
      throw err;
    }

    return { accumulatedContent, accumulatedThinking, finalResponse };
  }
}
