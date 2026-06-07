# LLM Hyperparameters Tuner (llm-hyperparameters-tuner)

A React-based single-page application designed to isolate and compare how changing a single LLM parameter affects model outputs. Built for rapid hypothesis testing, deterministic reproduction, and research-friendly visualization.

## Features

- Parallel, non-streaming evaluation of multiple parameter configurations
- Single variable parameter with user-defined `from`, `to`, and step count
- Fixed seed by default (configurable to random) for reproducible results
- Constrained 1024px layout with responsive grid and uniform-height result cards
- Collapsible input panel during execution, expandable on cancel/complete
- Feature Sliced Design architecture with in-memory state management

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build:** Vite (HMR, type-checking)
- **Styling:** Tailwind CSS (utility-first, constrained wrapper, grid layout)
- **Architecture:** Feature Sliced Design (FSD)
- **State:** `useState` only (no Context/Redux initially; designed for later migration)
- **Tooling:** ESLint + Prettier

## Getting Started

```bash
# Clone and install dependencies
git clone <repo-url> && cd llm-hyperparameters-tuner
npm install

# Start development server
npm run dev

# Lint & format
npm run lint
npm run format
```

## Workflow Overview

1. Set static LLM parameters (temperature, min_p, min_k, presence_penalty, etc.)
2. Choose one parameter to vary; define `from`, `to`, and step count
3. Enter a fixed prompt
4. Click **Execute** → input panel collapses, parallel requests fire simultaneously
5. Results populate in a responsive grid with parameter hints + expandable/collapsible blocks
6. Click **Cancel** at any time to abort requests and restore the input panel

## Architecture Brief

See `ARCHITECTURE.md` for FSD boundaries, state flow, execution orchestration, and UI rules.  
See `AGENTS.md` for AI coding agent guidelines and generation constraints.
