import type { IGenerationPrompts, IGenerationResult, ILlmApiConfig, ILlmParameter } from './types';

export const DEFAULT_API_CONFIG: ILlmApiConfig = {
  url: 'http://localhost:11434/api/generate',
  selectedModelName: 'qwen3.6:35b-a3b',
};

export const DEFAULT_LLM_PARAMETERS: Array<ILlmParameter> = [
  {
    label: 'Context size',
    name: 'num_ctx',
    value: 1024,
    min: 1,
    max: 204800,
    isVariable: false,
    startVariateFrom: null,
    endVariateTo: null,
    stepsCount: null,
  },
  {
    label: 'Max tokens',
    name: 'max_tokens',
    value: 512,
    min: 1,
    max: 102400,
    isVariable: false,
    startVariateFrom: null,
    endVariateTo: null,
    stepsCount: null,
  },
  {
    label: 'Temperature',
    name: 'temperature',
    value: 1,
    min: 0,
    max: 2,
    isVariable: false,
    startVariateFrom: null,
    endVariateTo: null,
    stepsCount: null,
  },
  {
    label: 'Min P',
    name: 'min_p',
    value: 0.9,
    min: 0,
    max: 1,
    isVariable: false,
    startVariateFrom: null,
    endVariateTo: null,
    stepsCount: null,
  },
  {
    label: 'Top K',
    name: 'top_k',
    value: 0,
    min: 0,
    max: 100,
    isVariable: false,
    startVariateFrom: null,
    endVariateTo: null,
    stepsCount: null,
  },
  {
    label: 'Top P',
    name: 'top_p',
    value: 0.9,
    min: 0,
    max: 1,
    isVariable: false,
    startVariateFrom: null,
    endVariateTo: null,
    stepsCount: null,
  },
  {
    label: 'Presence penalty',
    name: 'presence_penalty',
    value: 0,
    min: -2,
    max: 2,
    isVariable: false,
    startVariateFrom: null,
    endVariateTo: null,
    stepsCount: null,
  },
] as const;

export const DEFAULT_GENERATION_PROMPTS: IGenerationPrompts = {
  systemPrompt: null,
  prompt: 'What is the meaning of life?',
};

export const MOCK_GENERATION_RESULTS: Array<IGenerationResult> = Array.from({ length: 4 }, (_, i) => ({
  model: 'llama3.2',
  configs: {
    promptConfigs: {
      systemPrompt: null,
      prompt: `This is a test prompt for the ${String(i + 1)}th generation result.`,
    },
    hyperparameters: {
      num_ctx: 2048,
      max_tokens: 512,
      min_p: 0.9,
      top_k: 0,
      top_p: 0.9,
      presence_penalty: 0,
    },
  },
  createdAt: new Date().toISOString(),
  status: 'ready',
  generationOutputResult:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
}));
