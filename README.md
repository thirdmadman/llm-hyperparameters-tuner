# LLM Hyperparameters Tuner (llm-hyperparameters-tuner)

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev)

> A React-based single-page application designed to isolate and compare how changing a single LLM parameter affects model outputs. Built for rapid hypothesis testing, deterministic reproduction, and research-friendly visualization.

## 🧠 What It Does

LLM Hyperparameters Tuner lets you run **parallel, non-streaming evaluations** across multiple configurations of an LLM, varying **exactly one parameter at a time** while keeping all others frozen. This makes it trivial to observe how changes to temperature, top_k, top_p, min_p, and other generation parameters impact model outputs for a fixed prompt.

Perfect for:

- **Ablation studies** — isolate the impact of individual hyperparameters
- **Prompt engineering** — compare outputs under different generation settings
- **Model benchmarking** — systematic evaluation across parameter sweeps
- **Research workflows** — deterministic, reproducible, and easily shareable

## ✨ Key Features

| Feature | Description |
| ------- | ----------- |
| **Single-Variable Sweeps** | Define one parameter to vary (`from` → `to` → steps) and watch the others stay fixed |
| **Parallel Execution** | All configurations are dispatched simultaneously via `Promise.all` with explicit abort control |
| **Reproducible Results** | Fixed seed by default (toggleable to random) ensures consistent, repeatable runs |
| **Streaming with Cancellation** | Real-time progress display with instant abort support |
| **Generation Statistics** | Each result card shows token counts, durations, and eval metrics from Ollama |
| **Responsive Grid Layout** | Uniform-height cards in a 4-column grid with progressive disclosure (expandable responses) |
| **Collapsible Input Panel** | UI focuses on results during execution, expands back on complete/cancel |
| **FSD Architecture** | Feature Sliced Design with strict layer boundaries — zero external state managers |
| **Strict TypeScript** | Zero `any`, explicit interfaces, discriminated unions for execution phases |

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Build:** Vite (HMR, type-checking)
- **Styling:** Tailwind CSS (utility-first, constrained wrapper, grid layout)
- **Architecture:** Feature Sliced Design (FSD)
- **State:** `useState` only (no Context/Redux initially; designed for later migration)
- **Tooling:** ESLint + Prettier

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (recommended 20+ LTS)
- [npm](https://www.npmjs.com/) 9+ (or `pnpm` / `yarn`)
- A running [Ollama](https://ollama.ai) instance on `http://localhost:11434`
- A pulled model (e.g., `ollama pull qwen3.6:35b-a3b` or any of your choice)

### Installation

```bash
# Clone the repository
git clone https://github.com/thirdmadman/llm-hyperparameters-tuner.git
cd llm-hyperparameters-tuner

# Install dependencies
npm install

# (Optional) Verify setup
npm run lint
```

### Configuration

The application connects to Ollama by default at `http://localhost:11434`. You can change the API URL and model in the **LLM API Configuration** panel on the home screen.

Default configuration:

| Setting | Default Value |
| ------- | ------------- |
| **API URL** | `http://localhost:11434/` |
| **Model** | `qwen3.6:35b-a3b` |
| **Seed** | Fixed (configurable) |
| **Default prompt** | "What is the meaning of life?" |
| **Enabled parameters** | `num_ctx: 1024`, `num_predict: 512` |

### Usage

1. **Set Static Parameters** — Adjust any hyperparameters you want to keep constant (temperature, top_k, etc.)
2. **Select a Variable Parameter** — Pick one parameter to vary (temperature, min_p, top_p, etc.)
3. **Define the Range** — Set `from`, `to`, and number of steps (e.g., `0.0 → 1.0` in `5` steps)
4. **Enter a Prompt** — Type your prompt and optional system prompt
5. **Click Execute** — Watch parallel requests fire simultaneously; results populate in the grid below
6. **Compare** — Each card shows the varied parameter value, generation output, and Ollama metrics
7. **Cancel** — Click Cancel at any time to abort all pending requests and restore the input panel

### Available Scripts

```bash
# Start the development server with HMR
npm run dev

# Build for production (type-checks + minifies)
npm run build

# Preview the production build locally
npm run preview

# Run ESLint (strict mode, zero-warnings policy)
npm run lint
```

The development server opens at `http://localhost:3000`.

## 📖 Documentation

| Resource | Description |
| -------- | ----------- |
| [ARCHITECTURE.md](ARCHITECTURE.md) | FSD boundaries, state flow, parallel execution model, UI rules |
| [API_REFERENCE.md](API_REFERENCE.md) | Ollama request/response schemas, parameter sweep rules, error handling |
| [AGENTS.md](AGENTS.md) | AI coding agent guidelines and generation constraints |

## 🆘 Support

- **Issues:** Report bugs, request features, or ask questions via [GitHub Issues](https://github.com/thirdmadman/llm-hyperparameters-tuner/issues)
- **Ollama Docs:** [ollama.ai/docs](https://ollama.ai/docs) — model pulling, API reference, and server configuration
- **Parameter Reference:** [Ollama Generation Options](https://github.com/ollama/ollama/blob/main/docs/api.md#generation-parameters)

## 🛠️ Maintainers & Contributing

### Maintainer

- **Author:** [thirdmadman](https://github.com/thirdmadman)

### Contributing

We welcome contributions! Before submitting a PR:

1. Follow the [FSD architecture](ARCHITECTURE.md) — respect layer boundaries and import direction
2. Use strict TypeScript — no `any`, explicit interfaces, discriminated unions where appropriate
3. Ensure all ESLint rules pass with zero warnings (`npm run lint`)
4. Test against a live Ollama instance before submitting
5. Keep PRs focused on a single concern

See [AGENTS.md](AGENTS.md) for detailed coding guidelines and architectural rules.
