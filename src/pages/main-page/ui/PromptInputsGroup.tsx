export interface IPromptInputsGroupProps {
  isCollapsed: boolean;
}

export function PromptInputsGroup({ isCollapsed }: IPromptInputsGroupProps) {
  return (
    <div
      className={`flex flex-col gap-3 transition-all duration-300 ${
        isCollapsed ? 'max-h-0 overflow-hidden opacity-0' : 'max-h-screen opacity-100'
      }`}
    >
      <textarea
        className="w-full h-32 p-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Enter your prompt here..."
        defaultValue="What is the meaning of life?"
        disabled={isCollapsed}
      />
    </div>
  );
}
