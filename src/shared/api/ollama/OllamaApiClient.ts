import { Ollama } from 'ollama/browser';

import type { ChatResponse, Message } from 'ollama/browser';
import type { ILlmApiConfig } from '@/entities/llm-api-config';
import type { ILlmGenerationConfig } from '@/entities/llm-generation-config';

interface IVirtualAbortableStream {
  id: string;
  isDone: boolean;
  isPlannedToAbort: boolean;
}

export class OllamaApiClient {
  private client: Ollama;
  private requestStreams: Array<IVirtualAbortableStream> = [];

  constructor(apiConfig?: ILlmApiConfig) {
    const host = apiConfig?.url ?? 'http://127.0.0.1:11434';
    this.client = new Ollama({ host });
  }

  abort() {
    this.requestStreams = this.requestStreams.filter((el) => !el.isDone);
    this.requestStreams = this.requestStreams.map((el) => ({ ...el, isPlannedToAbort: true }));
  }

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

    const uuid = crypto.randomUUID();

    const steamWrapper: IVirtualAbortableStream = {
      id: uuid,
      isDone: false,
      isPlannedToAbort: false,
    };

    this.requestStreams.push(steamWrapper);

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
        const currentStream = this.requestStreams.find((el) => el.id === uuid);
        if (!currentStream) {
          stream.abort();
          throw new Error('Virtual stream not found, aborting stream');
        }

        if (currentStream.isPlannedToAbort) {
          stream.abort();
          this.requestStreams = this.requestStreams.filter((el) => el.id !== uuid);
          throw new Error(`Stream aborted: got virtual stream signal for abort, uuid:, ${uuid}`);
        }

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
          this.requestStreams = this.requestStreams.map((el) => (el.id === uuid ? { ...el, isDone: true } : el));

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
