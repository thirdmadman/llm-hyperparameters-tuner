# AGENTS.md — AI Coding Agent Guidelines

## 1. Project Context & Hard Constraints

- **Purpose:** Isolate and compare how varying exactly one LLM parameter affects outputs for a fixed prompt/model/seed setup.
- **Architecture:** Feature Sliced Design (FSD) with strict layer boundaries. No external state managers, no Context API, no localStorage/URL persistence. In-memory `useState` only.
- **API Interaction:** Parallel, non-streaming requests to Ollama via native `fetch`. All parameters frozen except one stepped variable. Fixed seed by default (toggleable). Full responses awaited before aggregation.
- **UI/UX:** Constrained ~1024px wrapper. Top: grouped static params + variable range controller. Middle: prompt textarea → execute/cancel button. Bottom: responsive 4-column grid with uniform-height cards. Input panel collapses during execution, expands on complete/cancel. Tailwind CSS only.
- **Tooling:** TypeScript (strict), ESLint + Prettier, Vite dev server. Zero external UI component libraries.

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
- Imports must use configured FSD aliases (for example: `@entities/...`, `@features/...`, `@widgets/...`).
- No circular dependencies.
- Pages orchestrate business flows and state transitions.
- Widgets compose UI from entities and feature outputs.
- Features expose public APIs through barrel exports and must not depend on widgets or pages.
- Entities define domain contracts, types, and business structures.
- Shared modules must remain domain-independent.
- Type definitions should flow downward through the dependency graph and never upward.

## 3. Code Generation Guidelines & Component Structure

- **React Components:** Functional only. Explicit prop interfaces. No default exports without named fallbacks if consumed by FSD index files.

  ```tsx
  export function InputPanel({ onExecute, onCancel, config } : IInputPanelProps) { ... }
  ```

- **TypeScript:** Strict mode enforced. Zero `any`. Prefer explicit over inference. Use discriminated unions for execution phases (`idle | executing | completed | cancelled`). Interfaces prefixed with "I" (ex. "IResult") and types prefixed with "T" (ex. `TResult`, `TConfig`).
- **Tailwind CSS:** Utility-only. Group classes by function (structure → layout → state → theme). No arbitrary values unless absolutely necessary (justify with comment). Enforce uniform heights via `flex min-h-[...]` or `grid-rows`.
- **File Organization:** One feature/component per directory. `index.ts` re-exports for clean imports. Types live in `types.ts` or directly in the main module if single-use.

## 4. State Management & Prop Composition Rules

- All state lives in component-scoped `useState`. Lift only vertically through explicit props.
- Execution lifecycle flag (`isExecuting: boolean`) must be centralized in the orchestrating widget/page and passed down via props or local state context where strictly necessary.
- Abort controllers are managed as `useRef<AbortController[]>([])` or within `features/execution-dispatcher`. Never leak outside feature boundaries.
- Results array shape is fixed post-execution, ex.:

  ```ts
  type TestResult = {
    id: string;
    config: LLMConfigSnapshot;
    response: string;
    status: 'success' | 'error';
    timestamp: number;
  }
  ```

## 5. API Interaction & Execution Lifecycle Standards

- **Payload Construction:** Merge static parameters + stepped variable parameter + `seed` (fixed/random) + `"stream": false`. Validate against schema before dispatch.
- **Parallel Dispatch:** Use `Promise.all(promises)` with explicit abort pool tracking. Do not use `setTimeout` or sequential chains.
- **Cancellation:** On cancel, iterate active abort controllers → `.abort()`, catch `DOMException: aborted`, clear state, restore UI to idle.
- **Error Handling:** Fail-fast. Network/timeout → `{ status: 'error', message, code }`. Invalid payload → early exit with console error + UI toast/alert (if implemented later).

## 6. Iterative Development Workflow (Step-by-Step)

- **Foundation:** Initialize Vite + TypeScript + Tailwind, plus linting/formatting setup
- **Architecture:** Set up FSD directory structure and configure path aliases
- **Domain:** Define core entities and data models (LLM config, results, execution states)
- **Shared Layer:** Implement utilities and Ollama API client with payload transformation
- **Features:** Build parameter stepping logic and execution dispatcher with parallel abort control
- **Widgets:** Create input/configuration UI and results grid components
- **Orchestration:** Connect features and widgets in page-level workflow and state transitions
- **Integration:** Wire application entry point and ensure end-to-end execution flow
- **Validation:** Verify UI behavior, performance, responsiveness, and strict FSD compliance

## 7. Validation, Testing & Self-Audit Prompts

- **Pre-Merge Checklist:**
  - [ ] No `any`, no Context API, no external state libs
  - [ ] FSD import paths verified, zero circular deps
  - [ ] Parallel dispatch uses `Promise.all` + explicit abort pool
  - [ ] Input panel collapses/expands correctly on execute/cancel
  - [ ] Grid cards are uniform height with parameter hints + expandable text
  - [ ] ESLint & Prettier pass with zero errors/warnings
- **Manual QA Focus:** Parallel request timing, cancellation responsiveness, grid layout consistency, step interpolation accuracy, seed behavior (fixed vs random)
- **Agent Self-Audit Prompt:**
  > "Verify FSD boundaries are strictly maintained. Confirm state lives only in useState. Ensure API uses non-streaming fetch with parallel dispatch and abort control. Check UI matches constrained wrapper, collapse/expand behavior, and uniform grid heights. Report any architectural drift."
