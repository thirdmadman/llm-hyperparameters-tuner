import { InputNumber } from './InputNumber';
import { InputRange } from './InputRange';
import type { ILlmParameter } from '@/entities/llm-parameter';

interface ILlmParameterInputProps {
  llmParameter: ILlmParameter;
  onSelectEvent: () => void;
  onUpdateEvent: (parameterNewState: ILlmParameter) => void;
  onToggleEnabledEvent: () => void;
}

export function LlmParameterInput({
  llmParameter,
  onSelectEvent,
  onUpdateEvent,
  onToggleEnabledEvent,
}: ILlmParameterInputProps) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-lg border p-4 ${
        !llmParameter.isEnabled
          ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 opacity-75'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
      }`}
    >
      {/* Main row: Label + Value Input + Toggle + Variable Button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <label
            className={`text-sm font-medium w-32 shrink-0 ${!llmParameter.isEnabled ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-700 dark:text-gray-300'}`}
          >
            {llmParameter.label}
          </label>
          {!llmParameter.isVariable && llmParameter.isEnabled && (
            <InputNumber
              value={llmParameter.value}
              onChange={(value) => {
                onUpdateEvent({ ...llmParameter, value: value });
              }}
              step={llmParameter.label.includes('penalty') || llmParameter.label.includes('P') ? 0.01 : 1}
              disabled={!llmParameter.isEnabled}
            />
          )}
        </div>
        <div className="flex gap-4">
          {/* Enable/Disable Toggle Button */}
          <button
            onClick={onToggleEnabledEvent}
            className={`shrink-0 px-3 py-1.5 text-xs font-medium rounded-md transition-colors border ${
              llmParameter.isEnabled
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {llmParameter.isEnabled ? 'Enabled' : 'Disabled'}
          </button>
          <button
            onClick={() => {
              onSelectEvent();
            }}
            className={`shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              !llmParameter.isEnabled
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : llmParameter.isVariable
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            disabled={!llmParameter.isEnabled}
          >
            {llmParameter.isVariable ? '✓ Selected as Variable' : 'Select as Variable'}
          </button>
        </div>
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
