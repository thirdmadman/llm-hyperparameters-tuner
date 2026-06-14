import { useState } from 'react';

import { GenerationStatisticsBlock } from './GenerationStatisticsBlock';
import { StatusBadge } from './StatusBadge';
import type { IGenerationResult } from '@/entities/generation-result';

export type TGenerationResultCardStatus = 'idle' | 'completed';

export interface IGenerationResultCardProps {
  variableParameterLabel: string;
  variableParameterValue: number;
  generationResult: IGenerationResult;
}

const ExpandIcon = ({ isExpanded }: { isExpanded: boolean }) => (
  <svg
    className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export function GenerationResultCard({
  variableParameterLabel,
  variableParameterValue,
  generationResult,
}: IGenerationResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isThinkingExpanded, setIsThinkingExpanded] = useState(false);
  const [isToolCallsExpanded, setIsToolCallsExpanded] = useState(false);

  const { status, generationContentResult, generationThinkingResult, generationToolCalls } = generationResult;

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };
  const toggleThinking = () => {
    setIsThinkingExpanded((prev) => !prev);
  };
  const toggleToolCalls = () => {
    setIsToolCallsExpanded((prev) => !prev);
  };

  return (
    <div
      className={`flex flex-col rounded-lg border p-4 transition-all ${isExpanded ? 'col-span-full' : ''} ${
        status === 'error'
          ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
          : 'border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-800'
      } ${isExpanded ? '' : 'min-h-[280px]'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {variableParameterLabel} = {variableParameterValue}
        </span>
        <div className="flex items-center gap-3">
          <StatusBadge status={status} isSmall={!isExpanded} />
          <button
            onClick={toggleExpand}
            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
            aria-label={isExpanded ? 'Collapse card' : 'Expand card'}
          >
            <ExpandIcon isExpanded={isExpanded} />
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {/* 2. Thinking Section (Collapsible, distinct style) */}
      {generationThinkingResult && (
        <div className="py-2">
          {status === 'loading' && !generationContentResult && (
            <p className="text-sm text-gray-400 italic">Thinking...</p>
          )}
          <button
            onClick={toggleThinking}
            className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline py-2 cursor-pointer"
          >
            <ExpandIcon isExpanded={isThinkingExpanded} />
            {isThinkingExpanded ? 'Collapse' : 'Expand'} Thinking Process
          </button>
          <div
            className={`transition-all duration-300 ease-in-out ${
              isThinkingExpanded ? 'max-h-[500px] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'
            }`}
          >
            <p
              className={`text-sm text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-900 p-3 rounded-md border border-gray-200 dark:border-gray-700 leading-relaxed ${isThinkingExpanded ? 'whitespace-pre-wrap' : 'line-clamp-6'}`}
            >
              {generationThinkingResult}
            </p>
          </div>
        </div>
      )}

      <div className={`flex-1 mb-3 ${isExpanded ? '' : 'overflow-hidden'}`}>
        <div className="mb-4">
          {status === 'loading' && !generationContentResult && (
            <p className="text-sm text-gray-400 italic">Waiting for response...</p>
          )}
          {status === 'loading' && generationContentResult && (
            <p className="text-sm text-gray-400 italic">Streaming response...</p>
          )}
          <p
            className={`text-sm text-gray-700 dark:text-gray-300 leading-relaxed ${isExpanded ? 'whitespace-pre-wrap' : 'line-clamp-6'}`}
          >
            {generationContentResult}
          </p>
        </div>

        {/* 3. Tool Calls Section (Collapsible, distinct style) */}
        {generationToolCalls && generationToolCalls.length > 0 && (
          <div className="mb-4">
            <button
              onClick={toggleToolCalls}
              className="flex items-center gap-1 text-xs font-medium text-orange-600 dark:text-orange-400 hover:underline mb-1 cursor-pointer"
            >
              <ExpandIcon isExpanded={isToolCallsExpanded} />
              {isToolCallsExpanded ? 'Collapse' : 'Expand'} Function Calls ({generationToolCalls.length})
            </button>
            <div
              className={`transition-all duration-300 ease-in-out ${
                isToolCallsExpanded ? 'max-h-[500px] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'
              }`}
            >
              <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-3 space-y-2">
                {generationToolCalls.map((tool, idx) => (
                  <div key={idx} className="text-xs font-mono">
                    <div className="font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Function: {tool.function.name}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                      <pre className="whitespace-pre-wrap break-all">{tool.function.arguments}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer: Statistics */}
      {status === 'ready' && <GenerationStatisticsBlock generationResult={generationResult} />}
    </div>
  );
}
