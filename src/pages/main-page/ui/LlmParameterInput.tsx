import type { ILlmParameter } from '../types';

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
            <input
              type="number"
              value={llmParameter.value}
              onChange={(e) => {
                onUpdateEvent({ ...llmParameter, value: parseInt(e.target.value, 10) });
                console.log('Parameter value changed:', e.target.value);
              }}
              step={llmParameter.label.includes('penalty') || llmParameter.label.includes('P') ? 0.01 : 1}
              className="w-24 px-2 py-1.5 text-sm font-mono rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

      {/* Expanded range inputs */}
      {llmParameter.isVariable && (
        <div className="flex flex-col gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-500 dark:text-gray-400 w-12 shrink-0">From:</label>
            <input
              type="range"
              min={llmParameter.min}
              max={
                (llmParameter.endVariateTo ?? 0 > llmParameter.max)
                  ? (llmParameter.endVariateTo ?? 0)
                  : llmParameter.max
              }
              value={llmParameter.startVariateFrom ?? 0}
              onChange={(e) => {
                onUpdateEvent({ ...llmParameter, startVariateFrom: parseInt(e.target.value, 10) });
              }}
              className="flex-1 accent-indigo-600"
            />
            <span className="text-xs font-mono text-gray-600 dark:text-gray-400 w-8 text-right">
              {llmParameter.startVariateFrom ?? 0}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-500 dark:text-gray-400 w-12 shrink-0">To:</label>
            <input
              type="range"
              min={
                (llmParameter.startVariateFrom ?? 0 > llmParameter.min)
                  ? (llmParameter.startVariateFrom ?? 0)
                  : llmParameter.min
              }
              max={llmParameter.max}
              value={llmParameter.endVariateTo ?? 0}
              onChange={(e) => {
                onUpdateEvent({ ...llmParameter, endVariateTo: parseInt(e.target.value, 10) });
              }}
              className="flex-1 accent-indigo-600"
            />
            <span className="text-xs font-mono text-gray-600 dark:text-gray-400 w-8 text-right">
              {llmParameter.endVariateTo ?? 0}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-500 dark:text-gray-400 w-12 shrink-0">Steps:</label>
            <input
              type="number"
              value={llmParameter.stepsCount ?? ''}
              onChange={(e) => {
                onUpdateEvent({ ...llmParameter, stepsCount: parseInt(e.target.value, 10) });
              }}
              step={1}
              placeholder="Steps"
              className="flex-1 px-2 py-1.5 text-sm font-mono rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
