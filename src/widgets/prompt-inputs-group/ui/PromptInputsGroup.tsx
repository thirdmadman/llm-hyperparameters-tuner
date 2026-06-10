import type { IGenerationPrompts } from '@/entities/llm-generation-config';

export interface IPromptInputsGroupProps {
  isCollapsed: boolean;
  prompts: IGenerationPrompts;
  onPromptsChange: (prompts: IGenerationPrompts) => void;
}

export function PromptInputsGroup({ isCollapsed, prompts, onPromptsChange }: IPromptInputsGroupProps) {
  const handleSystemPromptChange = (value: string) => {
    onPromptsChange({
      ...prompts,
      systemPrompt: value || null,
    });
  };

  const handlePromptChange = (value: string) => {
    onPromptsChange({
      ...prompts,
      prompt: value,
    });
  };

  return (
    <div
      className={`flex flex-col gap-3 transition-all duration-300 ${
        isCollapsed ? 'max-h-0 overflow-hidden opacity-0' : 'max-h-screen opacity-100'
      }`}
    >
      <textarea
        className="w-full h-24 p-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Enter system prompt (optional)..."
        value={prompts.systemPrompt ?? ''}
        onChange={(e) => {
          handleSystemPromptChange(e.target.value);
        }}
        disabled={isCollapsed}
      />
      <textarea
        className="w-full h-32 p-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Enter your prompt here..."
        value={prompts.prompt}
        onChange={(e) => {
          handlePromptChange(e.target.value);
        }}
        disabled={isCollapsed}
      />
    </div>
  );
}
