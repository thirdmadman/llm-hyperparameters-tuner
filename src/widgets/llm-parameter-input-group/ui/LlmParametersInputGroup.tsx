import { LlmParameterInput } from './LlmParameterInput';
import type { ILlmParameter } from '@/entities/llm-parameter';

export interface LlmParametersInputGroupProps {
  llmParameters: Array<ILlmParameter>;
  onParameterUpdateEvent: (parameter: ILlmParameter) => void;
  onParameterSelectedEvent: (parameter: ILlmParameter) => void;
  onToggleEnabledEvent: (parameter: ILlmParameter) => void;
}

export function LlmParametersInputGroup({
  llmParameters,
  onParameterUpdateEvent,
  onParameterSelectedEvent,
  onToggleEnabledEvent,
}: LlmParametersInputGroupProps) {
  const selectedVariableParameter = llmParameters.find((parameter) => parameter.isVariable);

  return (
    <div className="flex flex-col gap-4 ">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Parameters</h2>
      <div className="flex flex-col gap-4">
        {llmParameters.map((parameter) => (
          <LlmParameterInput
            key={parameter.name}
            llmParameter={parameter}
            onSelectEvent={() => {
              onParameterSelectedEvent(parameter);
            }}
            onUpdateEvent={onParameterUpdateEvent}
            onToggleEnabledEvent={() => {
              onToggleEnabledEvent(parameter);
            }}
          />
        ))}
      </div>
      {/* Variable Parameter Display */}
      {selectedVariableParameter && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Selected Variable Parameter</h3>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {selectedVariableParameter.label}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              From: {selectedVariableParameter.startVariateFrom ?? '—'} → To:{' '}
              {selectedVariableParameter.endVariateTo ?? '—'}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Steps: {selectedVariableParameter.stepsCount ?? '—'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
