import type { IGenerationResult } from '@/entities/generation-result';

export type TGenerationResultCardStatus = 'idle' | 'completed';

export interface IGenerationResultCardProps {
  variableParameterLabel: string;
  variableParameterValue: number;
  generationResult: IGenerationResult;
}

export function GenerationResultCard({
  variableParameterLabel,
  variableParameterValue,
  generationResult,
}: IGenerationResultCardProps) {
  const { status, generationOutputResult } = generationResult;
  return (
    <div
      className={`flex flex-col rounded-lg border p-4 min-h-[280px] transition-colors ${
        status === 'error'
          ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
          : 'border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-800'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {variableParameterLabel} = {variableParameterValue}
        </span>
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
      <div className="flex-1 overflow-hidden">
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-6">{generationOutputResult}</p>
      </div>
    </div>
  );
}
