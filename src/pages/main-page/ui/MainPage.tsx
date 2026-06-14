import { useEffect, useRef, useState } from 'react';

import { MainPageHeader } from './MainPageHeader';
import {
  type TGenerationResultsThrottledMap,
  createGenerationConfigsVariants,
  executeGeneration,
  initGenerationsResults,
  toggleMockExecution,
} from './utils';
import type { IGenerationResult } from '@/entities/generation-result';
import type { ILlmApiConfig } from '@/entities/llm-api-config';
import type { IGenerationPrompts } from '@/entities/llm-generation-config';
import type { ILlmParameter } from '@/entities/llm-parameter';
import { OllamaApiClient } from '@/shared/api/ollama/OllamaApiClient';
import { DEFAULT_API_CONFIG, DEFAULT_GENERATION_PROMPTS, DEFAULT_LLM_PARAMETERS } from '@/shared/mocks';
import { GenerationResultsGrid } from '@/widgets/generation-results-grid';
import { LlmApiConfigGroup } from '@/widgets/llm-api-config-group';
import { LlmParametersInputGroup } from '@/widgets/llm-parameter-input-group';
import { PromptInputsGroup } from '@/widgets/prompt-inputs-group';

// ─── Component ───────────────────────────────────────────────────────────────

export function MainPage() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [llmApiConfig, setLlmApiConfig] = useState<ILlmApiConfig>(DEFAULT_API_CONFIG);
  const [llmParameters, setLlmParameters] = useState<Array<ILlmParameter>>(DEFAULT_LLM_PARAMETERS);
  const [generationPrompts, setGenerationPrompts] = useState<IGenerationPrompts>(DEFAULT_GENERATION_PROMPTS);

  const [generationResults, setGenerationResults] = useState<Array<IGenerationResult> | null>(null);

  const generationResultsThrottledMapRef = useRef<TGenerationResultsThrottledMap>(new Map());
  const ollamaApiClientRef = useRef<OllamaApiClient | null>(null);

  useEffect(() => {
    ollamaApiClientRef.current = new OllamaApiClient(llmApiConfig);
    return () => {
      ollamaApiClientRef.current?.abort();
    };
  }, [llmApiConfig]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleVariableParameterSelect = (llmParameter: ILlmParameter) => {
    setLlmParameters((prev) =>
      prev.map((param) => {
        if (param.name === llmParameter.name) {
          const { startVariateFrom, endVariateTo, stepsCount } = param;

          if (startVariateFrom !== null && endVariateTo !== null && stepsCount !== null) {
            return { ...param, isVariable: true };
          } else {
            return { ...param, startVariateFrom: param.min, endVariateTo: param.max, stepsCount: 1, isVariable: true };
          }
        }

        return { ...param, isVariable: false };
      })
    );
  };

  const handleParameterUpdate = (llmParameter: ILlmParameter) => {
    setLlmParameters((prev) =>
      prev.map((param) => (param.name === llmParameter.name ? { ...param, ...llmParameter } : param))
    );
  };

  const handlePromptsChange = (newPrompts: IGenerationPrompts) => {
    setGenerationPrompts(newPrompts);
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    const llmGenerationConfigVariants = createGenerationConfigsVariants(llmParameters, generationPrompts);
    const generationsResults = initGenerationsResults(llmApiConfig.selectedModelName, llmGenerationConfigVariants);

    generationResultsThrottledMapRef.current = new Map<number, Partial<IGenerationResult>>();
    generationsResults.forEach((result, i) => generationResultsThrottledMapRef.current.set(i, result));
    setGenerationResults(generationsResults);

    try {
      await executeGeneration(
        ollamaApiClientRef.current,
        llmApiConfig,
        llmGenerationConfigVariants,
        generationResultsThrottledMapRef,
        setGenerationResults
      );
    } catch (error) {
      console.error('Execution failed:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCancel = () => {
    ollamaApiClientRef.current?.abort();
  };

  const handleMockToggle = () => {
    toggleMockExecution(generationResults, setIsExecuting, setGenerationResults);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-lg px-4 py-8">
        <MainPageHeader />

        {/* Top: LLM API Configuration */}
        <section className="mb-6 p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <LlmApiConfigGroup llmApiConfig={llmApiConfig} onLlmApiConfigUpdate={setLlmApiConfig} />
        </section>

        {/* Top: Parameter List (Single Column) */}
        <section className="mb-6 p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <LlmParametersInputGroup
            llmParameters={llmParameters}
            onParameterUpdateEvent={handleParameterUpdate}
            onParameterSelectedEvent={handleVariableParameterSelect}
          />
        </section>

        {/* Middle: Prompt */}
        <section className="mb-6">
          <PromptInputsGroup
            isCollapsed={isExecuting}
            prompts={generationPrompts}
            onPromptsChange={handlePromptsChange}
          />
        </section>

        {/* Action Buttons */}
        <section className="mb-6">
          <div className="flex justify-end gap-2">
            <button
              className="px-5 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isExecuting}
              onClick={handleExecute}
            >
              Execute
            </button>
            <button
              className="px-5 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={!isExecuting}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </section>

        {/* Bottom: Results Grid */}
        <section>
          <GenerationResultsGrid generationResults={generationResults} llmParameters={llmParameters} />
        </section>
      </div>

      {/* Mock toggle */}
      <button
        onClick={handleMockToggle}
        className="fixed bottom-4 right-4 px-3 py-1.5 text-xs font-medium rounded-full bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:opacity-80 transition-opacity"
        title="Toggle input panel collapse (mock)"
      >
        {isExecuting ? '▶ Simulate Complete' : '⏸ Simulate Executing'}
      </button>
    </div>
  );
}
