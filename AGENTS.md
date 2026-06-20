# AGENTS.md — AI Coding Agent Guidelines

## 1. Project Context & Hard Constraints

- **Purpose:** Isolate and compare how varying exactly one input dimension affects outputs for a fixed model setup. The variable dimension can be either one enabled LLM parameter or the saved prompt variants, never both at the same time. Seed is available as a normal toggleable parameter and is not fixed by default.
- **Architecture:** Feature Sliced Design (FSD) with strict layer boundaries. No external state managers, no Context API, no localStorage/URL persistence. In-memory `useState` + `useRef` only.
- **API Interaction:** Parallel, streaming requests to Ollama via `ollama/browser` package with virtual abort mechanism (not native `fetch` or `AbortController`). All parameters are frozen except one stepped parameter variable, or all parameters are frozen while prompt variants are varied. Seed is a regular toggleable parameter, not fixed by default. Full responses awaited before aggregation with throttled real-time updates (100ms interval).
- **UI/UX:** Constrained `max-w-screen-lg` responsive wrapper (`w-full max-w-screen-lg`). Top: grouped static params + variable range controller. Middle: prompt textarea → execute/cancel button. Bottom: responsive grid (1/2/4 columns, not fixed 4-column) with `min-h-[280px]` minimum-height cards. Only the prompt panel collapses during execution; LLM API config and parameters panels remain visible. Tailwind CSS only.
- **Tooling:** TypeScript (strict), ESLint + Prettier, Vite dev server on port 3000. Zero external UI component libraries. Dependencies: `react`, `react-dom`, `ollama`, `tailwindcss`, `@tailwindcss/vite`.
- **Build:** `npm run build` runs `tsc -b && vite build`. Vite uses its default production minifier; do not add `build.minify` unless there is a specific measured reason.
- **Deployment:** GitHub Pages is deployed by `.github/workflows/deploy-pages.yml` on pushes to `master` and by manual `workflow_dispatch`. The workflow installs with `npm ci`, runs `npm run lint`, builds with `npm run build -- --base=/llm-hyperparameters-tuner/`, uploads `dist/`, and deploys via GitHub's official Pages actions.

## 2. Feature Sliced Design (FSD) Boundaries & Import Rules

| Layer | Purpose | Allowed Imports |
| ------- | --------- | ----------------- |
| `app/` | Application bootstrap, entry points, global configuration | No cross-slice imports |
| `pages/` | Workflow orchestration and composition of widgets/features | Widgets, features, entities |
| `widgets/` | Composite UI blocks that combine entities and feature outputs | Entities, shared utilities, public feature APIs |
| `features/` | User-facing business actions and application behavior | Entities, shared layer |
| `entities/` | Domain models, contracts, and business types | No internal dependencies |
| `shared/api/` | External service communication, request mapping, API clients | None |
| `shared/utils/` | Framework-agnostic helpers and utility functions | None |

### Rules

- Follow FSD dependency direction:
  - `shared → entities → features → widgets → pages → app`
- Imports must use configured FSD aliases (for example: `@/entities/...`, `@/features/...`, `@/widgets/...`).
- No circular dependencies.
- Pages orchestrate business flows and state transitions.
- Widgets compose UI from entities and feature outputs.
- Features expose public APIs through barrel exports and must not depend on widgets or pages.
- Entities define domain contracts, types, and business structures.
- Shared modules must remain domain-independent.
- Type definitions should flow downward through the dependency graph and never upward.

### Widget Composition (Actual Structure)

The application has **no `app/` or `features/` slices** currently implemented. Business logic that would belong in `features/` resides in `pages/main-page/ui/utils.ts`. The actual page structure is:

- **Page:** `pages/main-page/` → composes all widgets
- **Widgets:**
  - `widgets/llm-api-config-group/` — API URL + Model Name inputs
  - `widgets/llm-parameter-input-group/` — Parameter list with enable/disable toggles and variable selection
  - `widgets/prompt-inputs-group/` — System prompt + user prompt textareas, prompt-variable selection, and saved prompt variants (only this collapses during execution)
  - `widgets/generation-results-grid/` — Responsive grid of result cards; shows parameter labels for parameter runs and prompt labels for prompt-variable runs
- **Result card components:**
  - `GenerationResultCard` — Shows parameter value, status badge, response content, thinking process, tool calls, and generation statistics
  - `StatusBadge` — Visual status indicator
  - `GenerationStatisticsBlock` — Token counts, durations, eval metrics
  - `ExpandButton` / `ExpandIcon` — Expand/collapse controls

## 3. Code Generation Guidelines & Component Structure

- **React Components:** Functional only. Explicit prop interfaces (prefixed with `I`, ex. `IGenerationResultCardProps`). Named exports preferred.

  ```tsx
  export function InputPanel({ onExecute, onCancel, config } : IInputPanelProps) { ... }
  ```

- **TypeScript:** Strict mode enforced. Zero `any`. Prefer explicit over inference. Interfaces prefixed with "I" (ex. `IGenerationResult`, `ILlmParameter`). Types prefixed with "T" where used (ex. `TLlmGenerationConfigVariants`, `TGenerationResultsThrottledMap`).
- **Tailwind CSS:** Utility-only. Group classes by function (structure → layout → state → theme). No arbitrary values unless absolutely necessary (justify with comment).
- **File Organization:** One feature/component per directory. `index.ts` re-exports for clean imports (barrel exports). Types live in `types.ts` or directly in the main module if single-use. Each widget/entity has `model/types.ts` for type definitions and `index.ts` for barrel exports.

## 4. State Management & Prop Composition Rules

- All state lives in component-scoped `useState` hooks. Lift only vertically through explicit props.
- Execution lifecycle flag (`isExecuting: boolean`) lives in the page-level component (`MainPage`) and is passed down via props.
- **Virtual abort mechanism:** Abort is managed via `requestStreams: Array<IVirtualAbortableStream>` inside `OllamaApiClient`. Each stream has `id`, `isDone`, `isPlannedToAbort` flags. On cancel, all streams get `isPlannedToAbort: true` and are filtered out once `isDone: true`. No `AbortController` instances are used.
- Results array shape (`IGenerationResult`):

  ```ts
  type IGenerationResult = {
    model: string;
    configs: ILlmGenerationConfig;
    createdAt: Date;
    status: 'error' | 'loading' | 'ready' | 'cancelled';
    generationContentResult: string | null;
    generationThinkingResult: string | null;
    isPartial: boolean;
    generationToolCalls: Array<{ function: { name: string; arguments: string } }> | null;
    doneReason?: string;
    totalDuration?: number;
    loadDuration?: number;
    promptEvalCount?: number;
    promptEvalDuration?: number;
    evalCount?: number;
    evalDuration?: number;
  }
  ```

- **Throttled updates:** During streaming, `setGenerationResults` is throttled to every 100ms via `createThrottledChunkHandler` using a `_throttleTimer` ref on the map.
- **Prompt variants:** `IGenerationPrompts` contains `systemPrompt`, `prompt`, and `promptVariants: Array<IPromptVariant>`. Each `IPromptVariant` has `id`, `systemPrompt`, `prompt`, and `isEditing`.
- **Variable exclusivity:** Selecting a parameter variable clears prompt-variable mode. Selecting prompt-variable mode clears all parameter `isVariable` flags and disables parameter variable selection in the UI.

## 5. API Interaction & Execution Lifecycle Standards

- **API Client:** Uses `ollama/browser` package (`import { Ollama } from 'ollama/browser'`). Constructor takes `{ host }` from `ILlmApiConfig.url`. Default host: `http://127.0.0.1:11434`.

- **Payload Construction:** Parameters are mapped via `mapLlmParametersToApiOptions(llmParameters)` which filters enabled parameters and builds a `Record<string, number>` from their `name`/`value` fields. Returned as `IOllamaGenerationHyperparameters`. No schema validation before dispatch.

- **Execution Flow:**
  1. `createGenerationConfigsVariants(llmParameters, generationPrompts, isPromptVariableSelected)` generates configs:
     - if prompts are variable, creates one config per saved prompt variant, or falls back to the current prompt pair
     - otherwise finds the enabled variable parameter and creates one config per step using linear interpolation rounded to 2 decimals
     - if no valid variable exists, creates one config from the current prompt pair and enabled parameters
  2. `initGenerationsResults(modelName, variants)` creates placeholder results with `status: 'loading'` and `isPartial: true`
  3. `executeGeneration(client, apiConfig, variants, resultsMapRef, setGenerationResults)` dispatches parallel streaming requests
  4. Each request calls `client.streamChat()` with throttled chunk handler callback
  5. Results aggregated via `Promise.all(promises)` — each promise handles its own error/abort case

- **Parallel Dispatch:** All generated configurations trigger independent `streamChat` calls via `Promise.all`. Each uses virtual abort tracking via `requestStreams`. No `setTimeout` or sequential chains.

- **Cancellation:** On cancel, `ollamaApiClient.abort()` sets `isPlannedToAbort: true` on all streams. The stream loop checks this flag each iteration, calls `stream.abort()`, and throws `AbortError`. Pending promises reject cleanly, state updates to `'cancelled'`, UI returns to idle.

- **Error Handling:**
  - Abort: `{ status: 'cancelled', isPartial: false }` — caught as `error.name === 'AbortError'`
  - Network/Server: `{ status: 'error', isPartial: false, ...data }` — logged to console.error
  - Invalid payload: early return with no execution (handled by `createGenerationConfigsVariants` returning single config when no variable parameter)
  - Missing client: `Promise.reject(new Error('API client is not initialized'))`

- **Mock Execution:** Development toggle button at bottom-right (`"▶ Simulate Complete"` / `"⏸ Simulate Executing"`) uses `MOCK_GENERATION_RESULTS` from defaults for testing without live Ollama.

## 6. Iterative Development Workflow (Step-by-Step)

- **Foundation:** Initialize Vite + TypeScript + Tailwind, plus linting/formatting setup
- **Architecture:** Set up FSD directory structure and configure path aliases in `vite.config.ts` and `tsconfig.app.json`
- **Domain:** Define core entities and data models (LLM config, results, execution states)
- **Shared Layer:** Implement `ollama/browser` client with virtual abort, parameter mapper utility, default mocks
- **Features:** Business logic in `pages/main-page/ui/utils.ts`: parameter stepping interpolation, throttled streaming handler, parallel execution dispatcher
- **Widgets:** Create input/configuration UI and results grid components
- **Orchestration:** Connect features and widgets in page-level workflow and state transitions
- **Integration:** Wire application entry point and ensure end-to-end execution flow
- **Validation:** Verify UI behavior, performance, responsiveness
- **Deployment:** GitHub Pages workflow builds the static Vite output from `dist/` with the repository base path `/llm-hyperparameters-tuner/`

## 7. Validation, Testing & Self-Audit Prompts

- **Pre-Merge Checklist:**
  - [ ] No `any`, no Context API, no external state libs
  - [ ] FSD import paths verified, zero circular deps
  - [ ] Parallel dispatch uses `Promise.all` + virtual abort pool via `OllamaApiClient.requestStreams`
  - [ ] Parameter-variable and prompt-variable modes remain mutually exclusive
  - [ ] Prompt panel collapses/expands correctly on execute/cancel; other panels remain visible
  - [ ] Grid uses responsive breakpoints (1/2/4 columns) with `min-h-[280px]` card minimums
  - [ ] ESLint & Prettier pass with zero errors/warnings
  - [ ] GitHub Pages build command works: `npm run build -- --base=/llm-hyperparameters-tuner/`
- **Manual QA Focus:** Streaming response timing, cancellation responsiveness via virtual abort, grid layout consistency across breakpoints, step interpolation accuracy
- **Note:** No test framework or test files exist in the current codebase.
- **Agent Self-Audit Prompt:**
  > "Verify FSD boundaries are strictly maintained. Confirm state lives only in useState/useRef. Ensure API uses ollama/browser streaming with virtual abort mechanism. Check UI matches responsive wrapper, prompt-only collapse behavior, and responsive grid breakpoints. Report any architectural drift."
