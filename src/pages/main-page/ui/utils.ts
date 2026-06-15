import type { RefObject } from 'react';

import type { ChatResponse } from 'ollama/browser';
import type { IGenerationResult } from '@/entities/generation-result';
import type { ILlmApiConfig } from '@/entities/llm-api-config';
import type {
  IGenerationPrompts,
  ILlmGenerationConfig,
  IOllamaGenerationHyperparameters,
} from '@/entities/llm-generation-config';
import type { ILlmParameter } from '@/entities/llm-parameter';
import { mapLlmParametersToApiOptions } from '@/shared/api/ollama/mapLlmParametersToApiOptions';
import type { OllamaApiClient } from '@/shared/api/ollama/OllamaApiClient';
import { MOCK_GENERATION_RESULTS } from '@/shared/mocks';

export type TGenerationResultsThrottledMap = Map<number, Partial<IGenerationResult> & { _throttleTimer?: number }>;

export type TLlmGenerationConfigVariants = Array<{
  config: ILlmGenerationConfig;
  index: number;
}>;

export function initGenerationsResults(
  model: string,
  llmGenerationConfigVariants: TLlmGenerationConfigVariants
): Array<IGenerationResult> {
  return Array.from({ length: llmGenerationConfigVariants.length }, (_el, i) => {
    const foundGenerationConfigVariant = llmGenerationConfigVariants.find((variant) => variant.index === i);

    if (!foundGenerationConfigVariant) {
      console.error('Warning: not found llmGenerationConfigVariant for index', i);
    }

    const placeholderGenerationConfig: IOllamaGenerationHyperparameters = {
      num_ctx: 2048,
      num_predict: 256,
      temperature: 0.7,
      top_k: 40,
      top_p: 0.9,
      min_p: 0.05,
      presence_penalty: 0,
      repeat_last_n: 64,
      frequency_penalty: 0,
      mirostat: 0,
      mirostat_tau: 5,
      mirostat_eta: 0.1,
      num_keep: 0,
      tfs_z: 1,
      typical_p: 1,
      num_thread: 0,
      seed: 0,
    };

    const placeholderPrompts: IGenerationPrompts = {
      systemPrompt: null,
      prompt: 'This is a placeholder prompt.',
    };

    const data: IGenerationResult = {
      model,
      configs: {
        promptConfigs: foundGenerationConfigVariant?.config.promptConfigs ?? placeholderPrompts,
        hyperparameters: foundGenerationConfigVariant?.config.hyperparameters ?? placeholderGenerationConfig,
      },
      createdAt: new Date(),
      status: 'loading',
      generationContentResult: '',
      generationThinkingResult: null,
      isPartial: true,
      generationToolCalls: null,
      doneReason: undefined,
      totalDuration: undefined,
      loadDuration: undefined,
      promptEvalCount: undefined,
      promptEvalDuration: undefined,
      evalCount: undefined,
      evalDuration: undefined,
    };

    return data;
  });
}

export function updateGenerationResultsInStateByGenerationResult(
  prev: Array<IGenerationResult>,
  index: number,
  generationResult: {
    accumulatedContent: string | null;
    accumulatedThinking: string | null;
    finalResponse: ChatResponse | null;
  } | null
): Array<IGenerationResult> {
  if (!generationResult) {
    return prev.map((result, i) => (i === index ? { ...result, ...data } : result));
  }

  const { finalResponse, accumulatedContent, accumulatedThinking } = generationResult;
  let data: Partial<IGenerationResult> | null = null;

  if (!finalResponse) {
    console.error('Warning: finalResponse is undefined for index', index);
    data = {
      status: 'error',
      isPartial: false,
      generationContentResult: accumulatedContent,
      generationThinkingResult: accumulatedThinking,
    };
  } else {
    data = {
      status: 'ready',
      isPartial: false,
      generationContentResult: accumulatedContent,
      generationThinkingResult: accumulatedThinking,
      doneReason: finalResponse.done_reason,
      totalDuration: finalResponse.total_duration,
      loadDuration: finalResponse.load_duration,
      promptEvalCount: finalResponse.prompt_eval_count,
      promptEvalDuration: finalResponse.prompt_eval_duration,
      evalCount: finalResponse.eval_count,
      evalDuration: finalResponse.eval_duration,
    };
  }

  return prev.map((result, i) => (i === index ? { ...result, ...data } : result));
}

export function createThrottledChunkHandler(
  index: number,
  resultsMapRef: RefObject<TGenerationResultsThrottledMap>,
  setGenerationResults: React.Dispatch<React.SetStateAction<Array<IGenerationResult> | null>>
) {
  return (content: string | null, thinking: string | null) => {
    const current = resultsMapRef.current.get(index);
    if (!current) {
      return;
    }

    resultsMapRef.current.set(index, {
      ...current,
      generationContentResult: content,
      generationThinkingResult: thinking,
    });

    const existing = resultsMapRef.current.get(index);
    if (!existing) {
      return;
    }

    // _throttleTimer is last setGenerationResults invocation timestamp, used to throttle updates to the state
    if (!('_throttleTimer' in existing) || existing._throttleTimer === undefined) {
      setGenerationResults(
        (prev) =>
          prev?.map((result, i) =>
            i === index ? { ...result, generationContentResult: content, generationThinkingResult: thinking } : result
          ) ?? []
      );

      existing._throttleTimer = Date.now();

      return;
    }

    if ('_throttleTimer' in existing && existing._throttleTimer) {
      const nextInvocationTime = existing._throttleTimer + 100;
      if (Date.now() >= nextInvocationTime) {
        setGenerationResults(
          (prev) =>
            prev?.map((result, i) =>
              i === index ? { ...result, generationContentResult: content, generationThinkingResult: thinking } : result
            ) ?? []
        );

        existing._throttleTimer = Date.now();

        return;
      }
    }
  };
}

export async function executeGeneration(
  client: OllamaApiClient | null,
  apiConfig: ILlmApiConfig,
  variants: Array<{ config: ILlmGenerationConfig; index: number }>,
  resultsMapRef: RefObject<TGenerationResultsThrottledMap>,
  setGenerationResults: React.Dispatch<React.SetStateAction<Array<IGenerationResult> | null>>
) {
  if (!client) {
    return Promise.reject(new Error('API client is not initialized'));
  }

  const promises = variants.map(async (variant, index) => {
    const onChunk = createThrottledChunkHandler(index, resultsMapRef, setGenerationResults);
    let generationResult = null;

    try {
      generationResult = await client.streamChat(apiConfig, variant.config, onChunk);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setGenerationResults(
          (prev) =>
            prev?.map((result, i) => (i === index ? { ...result, status: 'cancelled', isPartial: false } : result)) ??
            []
        );

        return null;
      } else {
        console.error('Execution failed:', error);
      }
    }

    setGenerationResults((prev) =>
      updateGenerationResultsInStateByGenerationResult(prev ?? [], index, generationResult)
    );

    return generationResult;
  });

  return Promise.all(promises);
}

export function toggleMockExecution(
  generationResults: Array<IGenerationResult> | null,
  setIsExecuting: React.Dispatch<React.SetStateAction<boolean>>,
  setGenerationResults: React.Dispatch<React.SetStateAction<Array<IGenerationResult> | null>>
) {
  setIsExecuting((prev) => !prev);
  if (generationResults) {
    setGenerationResults(null);
  } else {
    setGenerationResults(MOCK_GENERATION_RESULTS);
  }
}

export function createGenerationConfigsVariants(
  llmParameters: Array<ILlmParameter>,
  basePrompts: IGenerationPrompts
): TLlmGenerationConfigVariants {
  const variableParameter = llmParameters.find((llmParameter) => llmParameter.isVariable && llmParameter.isEnabled);
  if (!variableParameter) {
    return [
      {
        config: { promptConfigs: basePrompts, hyperparameters: mapLlmParametersToApiOptions(llmParameters) },
        index: 0,
      },
    ];
  }

  const { startVariateFrom, endVariateTo, stepsCount } = variableParameter;

  if (startVariateFrom === null || endVariateTo === null || stepsCount === null) {
    return [
      {
        config: { promptConfigs: basePrompts, hyperparameters: mapLlmParametersToApiOptions(llmParameters) },
        index: 0,
      },
    ];
  }

  const stepSize = (endVariateTo - startVariateFrom) / (stepsCount - 1);
  const variants: TLlmGenerationConfigVariants = [];

  for (let i = 0; i < stepsCount; i++) {
    const variableParameterNewValueRaw = startVariateFrom + stepSize * i;
    const variableParameterNewValue = Number.isInteger(variableParameterNewValueRaw)
      ? variableParameterNewValueRaw
      : Number(variableParameterNewValueRaw.toFixed(2));
    const llmParametersWithVariation = llmParameters.map((llmParameter) =>
      llmParameter.name === variableParameter.name
        ? { ...llmParameter, value: variableParameterNewValue }
        : llmParameter
    );

    const hyperparameters = mapLlmParametersToApiOptions(llmParametersWithVariation);

    const variant = {
      config: {
        promptConfigs: basePrompts,
        hyperparameters,
      },
      index: i,
    };

    variants.push(variant);
  }

  return variants;
}
