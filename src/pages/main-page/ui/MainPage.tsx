import { useState } from 'react';

import type { IGenerationResult, ILlmApiConfig, ILlmParameter } from '../types';
import { GenerationResultsGrid } from './GenerationResultsGrid';
import { LlmApiConfigGroup } from './LlmApiConfigGroup';
import { LlmParametersInputGroup } from './LlmParameterInputGroup';
import { MainPageHeader } from './MainPageHeader';
import { PromptInputsGroup } from './PromptInputsGroup';
import { MOCK_API_CONFIG, MOCK_GENERATION_RESULTS, MOCK_PARAMETERS } from '../mocks';

export function MainPage() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [llmApiConfig, setLlmApiConfig] = useState<ILlmApiConfig>(MOCK_API_CONFIG);
  const [llmParameters, setLlmParameters] = useState<Array<ILlmParameter>>(MOCK_PARAMETERS);
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
          <PromptInputsGroup isCollapsed={isExecuting} />
        </section>

        {/* Action Buttons */}
        <section className="mb-6">
          <div className="flex justify-end gap-2">
            <button
              className="px-5 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isExecuting}
            >
              Execute
            </button>
            <button
              className="px-5 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={!isExecuting}
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
