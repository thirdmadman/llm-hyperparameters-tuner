# LLM Hyperparameters Tuner (llm-hyperparameters-tuner)

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev)

> A React-based single-page application designed to isolate and compare how changing one LLM input dimension affects model outputs. Built for rapid hypothesis testing, reproducible parameter sweeps, prompt-variant comparison, and research-friendly visualization.

## 🧠 What It Does

LLM Hyperparameters Tuner lets you run **parallel, streaming evaluations** across multiple configurations of an LLM, varying **exactly one input dimension at a time** while keeping everything else frozen. The variable dimension can be one enabled generation parameter or a set of saved prompt variants. This makes it straightforward to observe how changes to temperature, top_k, top_p, min_p, seed, repeat penalty, prompts, and other inputs affect model outputs.

Perfect for:

- **Ablation studies** — isolate the impact of individual hyperparameters
- **Prompt engineering** — compare outputs under different generation settings
- **Model benchmarking** — systematic evaluation across parameter sweeps
- **Research workflows** — deterministic, reproducible, and easily shareable

## ✨ Key Features

| Feature | Description |
| ------- | ----------- |
| **Single-Variable Sweeps** | Define one enabled parameter to vary (`from` → `to` → steps) and watch the others stay fixed |
| **Prompt Variant Runs** | Save multiple prompt/system-prompt pairs and run them as the variable dimension |
| **Parallel Execution** | All configurations are dispatched simultaneously via `Promise.all` with virtual stream abort tracking |
| **Reproducible Results** | Seed is a normal toggleable parameter, so deterministic runs are available when enabled |
| **Streaming with Cancellation** | Real-time progress display with virtual abort support for all in-flight streams |
| **Generation Statistics** | Each result card shows token counts, durations, and eval metrics from Ollama |
| **Responsive Grid Layout** | Result cards use a responsive 1/2/4-column grid with progressive disclosure |
| **Collapsible Input Panel** | UI focuses on results during execution, expands back on complete/cancel |
| **FSD Architecture** | Feature Sliced Design with strict layer boundaries — zero external state managers |
| **Strict TypeScript** | Zero `any`, explicit interfaces, and strict compiler settings |

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Build:** Vite (HMR, type-checking, default production minifier)
- **Styling:** Tailwind CSS (utility-first, constrained wrapper, grid layout)
- **Architecture:** Feature Sliced Design (FSD)
- **State:** Component-scoped `useState` + `useRef` only; (no Context/Redux initially; designed for later migration; or persisted client state)
- **Tooling:** ESLint + Prettier
- **Deployment:** GitHub Pages via GitHub Actions

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20.19+ or 22.13+ (GitHub Actions uses Node 22)
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
| **Seed** | Disabled by default; enable as a regular parameter when deterministic output is needed |
| **Default prompt** | "What is the meaning of life?" |
| **Enabled parameters** | `num_ctx: 1024`, `num_predict: 512` |

### Usage

1. **Set Static Parameters** — Enable and adjust any hyperparameters you want to send to Ollama.
2. **Choose One Variable Mode** — Select either one enabled parameter or use prompts as the variable dimension.
3. **For Parameter Runs** — Set `from`, `to`, and number of steps, such as `0.0 → 1.0` in `5` steps.
4. **For Prompt Runs** — Add saved prompt variants from the prompt panel; each saved pair becomes one run.
5. **Click Execute** — Parallel streaming requests fire simultaneously and results populate in the grid below.
6. **Compare** — Each card shows the varied parameter or prompt label, generation output, thinking/tool-call details, and Ollama metrics.
7. **Cancel** — Click Cancel at any time to virtually abort all pending streams.

### Available Scripts

```bash
# Start the development server with HMR
npm run dev

# Build for production (type-checks + minifies)
npm run build

# Build for GitHub Pages project hosting
npm run build -- --base=/llm-hyperparameters-tuner/

# Preview the production build locally
npm run preview

# Run ESLint (strict mode, zero-warnings policy)
npm run lint
```

The development server opens at `http://localhost:3000`.

## 🌐 Deployment

The app is deployed to GitHub Pages by `.github/workflows/deploy-pages.yml`.

The workflow runs on pushes to `master` and can also be started manually from GitHub Actions. It installs dependencies with `npm ci`, runs `npm run lint`, builds `dist/` with the GitHub Pages base path, uploads the artifact, and deploys through GitHub's official Pages actions.

Published URL:

```text
https://thirdmadman.github.io/llm-hyperparameters-tuner/
```

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
