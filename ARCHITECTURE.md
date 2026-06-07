# Architecture Specification

## Design Philosophy

- **Test Isolation:** Only one parameter varies per run; all others remain frozen.
- **Deterministic Flow:** State transitions are synchronous, predictable, and driven by explicit prop lifting.
- **Research-First UI:** Uniform-height cards, condensed metadata hints, and progressive disclosure keep comparative analysis fast.
- **Zero External State:** `useState` only. Context API and global stores are intentionally excluded until Redux migration necessity arises.

## Feature Sliced Design (FSD) Boundaries

| Slice | Responsibility |
| ------- | ---------------- |
| `app/` | Bootstrap, router mount, Tailwind entry, index.tsx |
| `pages/main-page/` | Workflow orchestration container |
| `widgets/` | Composed UI blocks combining features and entities: Collapsible config block (params, range, prompt, button), Responsive grid + uniform-height card layout |
| `features/` | Isolated business logic and user-facing behaviors: Range interpolation & step generation logic, Parallel request coordinator, AbortController lifecycle, aggregation |
| `entities/` | Domain models, types, and core contracts: TypeScript interfaces for config, scenarios, responses |
| `shared/api/` | External communication layer and request handling: Fetch wrapper, payload mapper, constants, abort factory |
| `shared/utils/` | Pure utilities and framework-agnostic helpers: Array math, state guards, string formatters, validation |

## State Management Strategy

- All state lives in component-scoped `useState` hooks.
- Parent-child data flow uses explicit prop lifting only where strictly required (input → execution → results).
- No Context API, no global stores. Future Redux migration possible when coupling becomes unmanageable.
- Execution phase flag (`isExecuting: boolean`) drives UI collapse/expand via Tailwind class binding.

## Parallel Execution Model

- All interpolated configurations trigger independent `fetch` calls to Ollama simultaneously via `Promise.all`.
- Responses are awaited in full (no streaming). Each payload includes frozen static parameters, the stepped variable parameter, and a fixed/random seed.
- An array of `AbortController` instances enables instantaneous cancellation. Pending promises are rejected cleanly, state resets to idle, and input panel expands.

## UI & Layout Rules

- Main wrapper capped at 1024px (or fluid-responsive equivalent) with auto margins.
- Top section: grouped static parameters + variable range controls.
- Middle: prompt textarea → execute/cancel button.
- Bottom: results grid (4 columns default, responsive). Uniform card height enforced via flexbox stretching.
- Each card: top hint row (active parameter value), expandable response block toggled by local `useState`.
- Input panel collapses to a minimal toolbar during execution; expands automatically on complete or cancel.

## Scalability & Migration Path

- Current architecture avoids cross-cutting state until Redux is necessary.
- When parallel request counts exceed ~50 or UI coupling increases, `execution-dispatcher` and `results-grid` may be extracted into Redux slices with RTK Query for caching and abort control.
- FSD boundaries remain stable; only internal implementation shifts from local state to global store.
