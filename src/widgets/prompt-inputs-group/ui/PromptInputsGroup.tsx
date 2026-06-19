import { PromptVariantCard } from './PromptVariantCard';
import type { IGenerationPrompts, IPromptVariant } from '@/entities/llm-generation-config';

export interface IPromptInputsGroupProps {
  isCollapsed: boolean;
  prompts: IGenerationPrompts;
  isVariableSelected: boolean;
  onSetVariable: () => void;
  onClearVariable: () => void;
  onAddPromptVariantAndClearCurrent: (systemPrompt: string | null, prompt: string) => void;
  onSystemPromptChange: (value: string | null) => void;
  onPromptChange: (value: string) => void;
  onVariantUpdate: (variant: IPromptVariant) => void;
  onVariantDelete: (id: string) => void;
  onVariantToggleEdit: (id: string) => void;
}

export function PromptInputsGroup({
  isCollapsed,
  prompts,
  isVariableSelected,
  onSetVariable,
  onClearVariable,
  onAddPromptVariantAndClearCurrent,
  onSystemPromptChange,
  onPromptChange,
  onVariantUpdate,
  onVariantDelete,
  onVariantToggleEdit,
}: IPromptInputsGroupProps) {
  const handleAddPrompt = () => {
    onAddPromptVariantAndClearCurrent(prompts.systemPrompt, prompts.prompt);
  };

  const hasContent = (prompts.systemPrompt ?? '') !== '' || prompts.prompt !== '';

  return (
    <div
      className={`flex flex-col gap-3 transition-all duration-300 ${
        isCollapsed ? 'max-h-0 overflow-hidden opacity-0' : 'max-h-screen opacity-100'
      }`}
    >
      {/* Variable selection indicator */}
      {isVariableSelected && (
        <div className="flex items-center justify-between p-3 rounded-lg border border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Prompts are being varied</span>
          </div>
          <button
            className="px-3 py-1 text-xs font-medium rounded bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer transition-colors"
            onClick={onClearVariable}
          >
            Deselect
          </button>
        </div>
      )}

      {isVariableSelected && prompts.promptVariants.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
            Saved prompt variants:
          </span>
          {prompts.promptVariants.map((variant) => (
            <PromptVariantCard
              key={variant.id}
              variant={variant}
              onSave={onVariantUpdate}
              onDelete={onVariantDelete}
              onToggleEdit={onVariantToggleEdit}
            />
          ))}
        </div>
      )}

      {/* Current prompt inputs */}
      <textarea
        className="w-full h-24 p-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Enter system prompt (optional)..."
        value={prompts.systemPrompt ?? ''}
        onChange={(e) => {
          onSystemPromptChange(e.target.value || null);
        }}
        disabled={isCollapsed}
      />
      <textarea
        className="w-full h-32 p-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Enter your prompt here..."
        value={prompts.prompt}
        onChange={(e) => {
          onPromptChange(e.target.value);
        }}
        disabled={isCollapsed}
      />

      {/* Add prompt button (only when variable selected) */}
      {isVariableSelected && (
        <div className="flex justify-end">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors ${
              hasContent
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
            }`}
            disabled={!hasContent}
            onClick={handleAddPrompt}
          >
            Add Prompt
          </button>
        </div>
      )}

      {/* Set variable button (only when not selected) */}
      {!isVariableSelected && (
        <div className="flex justify-end">
          <button
            className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer transition-colors"
            onClick={onSetVariable}
          >
            Use Prompts as Variable
          </button>
        </div>
      )}
    </div>
  );
}
