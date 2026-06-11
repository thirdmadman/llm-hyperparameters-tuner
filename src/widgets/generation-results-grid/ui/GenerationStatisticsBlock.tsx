import type { IGenerationResult } from '@/entities/generation-result';

interface IGenerationStatisticsBlockProps {
  generationResult: IGenerationResult;
}

function formatDuration(ns: number | undefined): string {
  if (ns === undefined || ns === 0) return '-';

  // Convert nanoseconds to milliseconds
  const ms = ns / 1_000_000;

  if (ms < 1000) return `${String(Math.round(ms))}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatTokens(count: number | undefined): string {
  if (count === undefined) return '-';
  return count.toLocaleString();
}

function calculateTPS(evalCount: number | undefined, evalDurationNs: number | undefined): string {
  if (!evalCount || !evalDurationNs || evalDurationNs === 0) return '-';

  // Convert ns to seconds for calculation
  const durationSeconds = evalDurationNs / 1_000_000_000;
  const tps = evalCount / durationSeconds;

  return `${String(Math.round(tps))} tok/s`;
}

export function GenerationStatisticsBlock({ generationResult }: IGenerationStatisticsBlockProps) {
  const { totalDuration, loadDuration, promptEvalCount, evalCount, evalDuration } = generationResult;

  return (
    <details className="group mt-auto">
      <summary className="cursor-pointer text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 select-none">
        <span className="mr-1">⚙️</span> Generation Statistics
      </summary>
      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div className="text-gray-500 dark:text-gray-400">Total Duration:</div>
          <div className="font-mono text-right text-gray-700 dark:text-gray-300">{formatDuration(totalDuration)}</div>

          <div className="text-gray-500 dark:text-gray-400">Load Time:</div>
          <div className="font-mono text-right text-gray-700 dark:text-gray-300">{formatDuration(loadDuration)}</div>

          <div className="text-gray-500 dark:text-gray-400">Prompt Tokens:</div>
          <div className="font-mono text-right text-gray-700 dark:text-gray-300">{formatTokens(promptEvalCount)}</div>

          <div className="text-gray-500 dark:text-gray-400">Output Tokens:</div>
          <div className="font-mono text-right text-gray-700 dark:text-gray-300">{formatTokens(evalCount)}</div>

          <div className="text-gray-500 dark:text-gray-400">Tokens/Second:</div>
          <div className="font-mono text-right text-indigo-600 dark:text-indigo-400">
            {calculateTPS(evalCount, evalDuration)}
          </div>
        </div>
      </div>
    </details>
  );
}
