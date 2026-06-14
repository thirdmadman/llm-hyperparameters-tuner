import { InputNumber } from './InputNumber';
import { InputRange } from './InputRange';
import type { ILlmParameter } from '@/entities/llm-parameter';

interface ILlmParameterInputProps {
  llmParameter: ILlmParameter;
  onSelectEvent: () => void;
  onUpdateEvent: (parameterNewState: ILlmParameter) => void;
}

export function LlmParameterInput({ llmParameter, onSelectEvent, onUpdateEvent }: ILlmParameterInputProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      {/* Main row: Label + Value Input + Button (Right & Centered) */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-32 shrink-0">
            {llmParameter.label}
          </label>
          {!llmParameter.isVariable && (
            <InputNumber
              value={llmParameter.value}
              onChange={(value) => {
                onUpdateEvent({ ...llmParameter, value: value });
              }}
              step={llmParameter.label.includes('penalty') || llmParameter.label.includes('P') ? 0.01 : 1}
            />
          )}
        </div>

        <button
          onClick={() => {
            onSelectEvent();
          }}
          className={`shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            llmParameter.isVariable
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {llmParameter.isVariable ? '✓ Selected as Variable' : 'Select as Variable'}
        </button>
      </div>

      {llmParameter.isVariable && (
        <div className="flex flex-col gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <InputRange
            label="From:"
            min={llmParameter.min}
            max={
              (llmParameter.endVariateTo ?? 0 > llmParameter.max) ? (llmParameter.endVariateTo ?? 0) : llmParameter.max
            }
            value={llmParameter.startVariateFrom ?? 0}
            displayValue={llmParameter.startVariateFrom ?? 0}
            onChange={(value) => {
              onUpdateEvent({ ...llmParameter, startVariateFrom: value });
            }}
          />

          <InputRange
            label="To:"
            min={
              (llmParameter.startVariateFrom ?? 0 > llmParameter.min)
                ? (llmParameter.startVariateFrom ?? 0)
                : llmParameter.min
            }
            max={llmParameter.max}
            value={llmParameter.endVariateTo ?? 0}
            displayValue={llmParameter.endVariateTo ?? 0}
            onChange={(v) => {
              onUpdateEvent({ ...llmParameter, endVariateTo: v });
            }}
          />

          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-500 dark:text-gray-400 w-12 shrink-0">Steps:</label>
            <InputNumber
              value={llmParameter.stepsCount ?? 0}
              onChange={(value) => {
                onUpdateEvent({ ...llmParameter, stepsCount: value });
              }}
              step={1}
              placeholder="Steps"
            />
          </div>
        </div>
      )}
    </div>
  );
}
