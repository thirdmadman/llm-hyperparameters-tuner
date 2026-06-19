import { GenerationResultCard } from './GenerationResultCard';
import type { IGenerationResult } from '@/entities/generation-result';
import type { ILlmParameter } from '@/entities/llm-parameter';

interface IGenerationResultsGridProps {
  generationResults: Array<IGenerationResult> | null;
  isPromptVariableSelected: boolean;
  llmParameters: Array<ILlmParameter>;
}

export function GenerationResultsGrid({
  generationResults,
  isPromptVariableSelected,
  llmParameters,
}: IGenerationResultsGridProps) {
  const variableParameter = llmParameters.find((parameter) => parameter.isVariable);

  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Results</h2>
      {generationResults ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {generationResults.map((data, i) => (
            <GenerationResultCard
              key={i}
              promptVariableLabel={isPromptVariableSelected ? `Prompt #${String(i + 1)}` : null}
              variableParameterLabel={variableParameter?.label ?? ''}
              variableParameterName={variableParameter?.name ?? null}
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
