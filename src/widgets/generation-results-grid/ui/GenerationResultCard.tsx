import { useState } from 'react';

import { GenerationStatisticsBlock } from './GenerationStatisticsBlock';
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
  const { status, generationOutputResult } = generationResult;

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      className={`flex flex-col rounded-lg border p-4 transition-all ${isExpanded ? 'col-span-full' : ''} ${
        status === 'error'
          ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
          : 'border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-800'
      } ${isExpanded ? '' : 'min-h-[280px]'}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {variableParameterLabel} = {variableParameterValue}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleExpand}
            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label={isExpanded ? 'Collapse card' : 'Expand card'}
          >
            <ExpandIcon isExpanded={isExpanded} />
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
              status === 'ready'
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            {status === 'ready' ? '● Done' : '○ Idle'}
          </span>
        </div>
      </div>

      <div className={`flex-1 mb-3 ${isExpanded ? '' : 'overflow-hidden'}`}>
        <p
          className={`text-sm text-gray-700 dark:text-gray-300 ${isExpanded ? 'whitespace-pre-wrap' : 'line-clamp-6'}`}
        >
          {generationOutputResult}
        </p>
      </div>

      {status === 'ready' && <GenerationStatisticsBlock generationResult={generationResult} />}
    </div>
  );
}
