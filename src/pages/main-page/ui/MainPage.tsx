import { useState } from 'react';

import { MainPageHeader } from './MainPageHeader';
import type { IGenerationResult } from '@/entities/generation-result';
import type { ILlmApiConfig } from '@/entities/llm-api-config';
import type { IGenerationPrompts, ILlmGenerationConfig } from '@/entities/llm-generation-config';
import type { ILlmParameter } from '@/entities/llm-parameter';
import { mapLlmParametersToApiOptions } from '@/shared/api/ollama/mapLlmParametersToApiOptions';
import { OllamaApiClient } from '@/shared/api/ollama/OllamaApiClient';
import {
  DEFAULT_API_CONFIG,
  DEFAULT_GENERATION_PROMPTS,
  DEFAULT_LLM_PARAMETERS,
  MOCK_GENERATION_RESULTS,
} from '@/shared/mocks';
import { GenerationResultsGrid } from '@/widgets/generation-results-grid';
import { LlmApiConfigGroup } from '@/widgets/llm-api-config-group';
import { LlmParametersInputGroup } from '@/widgets/llm-parameter-input-group';
import { PromptInputsGroup } from '@/widgets/prompt-inputs-group';

const generateLlmResponse = async (
  llmApiConfig: ILlmApiConfig,
  generationPrompts: IGenerationPrompts,
  llmParameters: Array<ILlmParameter>
) => {
  const hyperparameters = mapLlmParametersToApiOptions(llmParameters);

  const llmGenerationConfig: ILlmGenerationConfig = { promptConfigs: generationPrompts, hyperparameters };

  const ollamaApiClient = new OllamaApiClient();
  const response = await ollamaApiClient.chat(llmApiConfig, llmGenerationConfig);
  console.log(response.message.content);

  const generationResult: IGenerationResult = {
    model: llmApiConfig.selectedModelName,
    configs: llmGenerationConfig,
    createdAt: response.created_at,
    status: 'ready',
    generationContentResult: response.message.content,
    generationThinkingResult: response.message.thinking ?? null,
    doneReason: response.done_reason,
    totalDuration: response.total_duration,
    loadDuration: response.load_duration,
    promptEvalCount: response.prompt_eval_count,
    promptEvalDuration: response.prompt_eval_duration,
    evalCount: response.eval_count,
    evalDuration: response.eval_duration,
  };

  return generationResult;
};

export function MainPage() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [llmApiConfig, setLlmApiConfig] = useState<ILlmApiConfig>(DEFAULT_API_CONFIG);
  const [llmParameters, setLlmParameters] = useState<Array<ILlmParameter>>(DEFAULT_LLM_PARAMETERS);
  const [generationPrompts, setGenerationPrompts] = useState<IGenerationPrompts>(DEFAULT_GENERATION_PROMPTS);
  const [generationResults, setGenerationResults] = useState<Array<IGenerationResult> | null>(null);

  const handleVariableParameterSelect = (llmParameter: ILlmParameter) => {
    setLlmParameters((prev) =>
      prev.map((param) =>
        param.name === llmParameter.name ? { ...param, isVariable: true } : { ...param, isVariable: false }
      )
    );
    console.log('Selected variable parameter:', llmParameter.label);
  };

  const handleParameterUpdate = (llmParameter: ILlmParameter) => {
    setLlmParameters((prev) =>
      prev.map((param) => (param.name === llmParameter.name ? { ...param, ...llmParameter } : param))
    );
    console.log('Parameter updated:', llmParameter.label);
  };

  const handlePromptsChange = (newPrompts: IGenerationPrompts) => {
    setGenerationPrompts(newPrompts);
  };

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
              onClick={() => {
                // TODO: Pass generationPrompts, llmApiConfig, llmParameters to execution feature
                console.log('Executing with:', { generationPrompts, llmApiConfig, llmParameters });
                setIsExecuting(true);

                void generateLlmResponse(llmApiConfig, generationPrompts, llmParameters).then((generationResult) => {
                  setGenerationResults([...(generationResults ?? []), generationResult]);
                  setIsExecuting(false);
                });

                // setGenerationResults([{ content: response }]); // Update with the new response
              }}
            >
              Execute
            </button>
            <button
              className="px-5 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={!isExecuting}
              onClick={() => {
                setIsExecuting(false);
                // TODO: Implement cancel logic (abort controllers)
              }}
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

      {/* Toggle button for mock demo */}
      <button
        onClick={() => {
          setIsExecuting((prev) => !prev);
          if (generationResults) {
            setGenerationResults(null);
          } else {
            setGenerationResults(MOCK_GENERATION_RESULTS);
          }
        }}
        className="fixed bottom-4 right-4 px-3 py-1.5 text-xs font-medium rounded-full bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:opacity-80 transition-opacity"
        title="Toggle input panel collapse (mock)"
      >
        {isExecuting ? '▶ Simulate Complete' : '⏸ Simulate Executing'}
      </button>
    </div>
  );
}
