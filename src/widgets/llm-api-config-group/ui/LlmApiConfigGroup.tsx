import type { ILlmApiConfig } from '@/entities/llm-api-config';

interface ILlmApiConfigGroupProps {
  llmApiConfig: ILlmApiConfig;
  onLlmApiConfigUpdate: (apiConfig: ILlmApiConfig) => void;
}

export function LlmApiConfigGroup({ llmApiConfig, onLlmApiConfigUpdate }: ILlmApiConfigGroupProps) {
  const handleChange = (field: keyof ILlmApiConfig) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onLlmApiConfigUpdate({ ...llmApiConfig, [field]: e.target.value });
  };

  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">LLM API Configuration</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="apiUrl" className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
            API URL
          </label>
          <input
            id="apiUrl"
            type="text"
            value={llmApiConfig.url}
            onChange={handleChange('url')}
            placeholder="http://localhost:11434"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-400"
          />
        </div>
        <div>
          <label htmlFor="modelName" className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
            Model Name
          </label>
          <input
            id="modelName"
            type="text"
            value={llmApiConfig.selectedModelName}
            onChange={handleChange('selectedModelName')}
            placeholder="llama3.1:8b"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-400"
          />
        </div>
      </div>
    </div>
  );
}
