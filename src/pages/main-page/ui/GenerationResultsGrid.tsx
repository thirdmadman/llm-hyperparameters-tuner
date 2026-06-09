import type { IGenerationResult, ILlmParameter } from '../types';
import { GenerationResultCard } from './GenerationResultCard';

interface IGenerationResultsGridProps {
  generationResults: Array<IGenerationResult> | null;
  llmParameters: Array<ILlmParameter>;
}

export function GenerationResultsGrid({ generationResults, llmParameters }: IGenerationResultsGridProps) {
  const variableParameter = llmParameters.find((param) => param.isVariable);

  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Results</h2>
      {generationResults ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {generationResults.map((data, i) => (
            <GenerationResultCard
              key={i}
              variableParameterLabel={variableParameter?.label ?? ''}
              variableParameterValue={variableParameter?.value ?? 0}
              generationResult={data}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center p-4">
          <p>No results available.</p>
        </div>
      )}
    </div>
  );
}
