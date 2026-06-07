# Ollama API Interaction Reference

## Base Configuration

* Base URL: `http://localhost:11434/api`
* Generate Endpoint: `POST /generate`
* Full Endpoint: `http://localhost:11434/api/generate`
* Headers:

  * `Content-Type: application/json`
* Streaming:

  * Enabled by default
  * For this project, requests should explicitly set `"stream": false`

---

## Request Schema

### Required Fields

| Field  | Type   | Required | Description                                   |
| ------ | ------ | -------- | --------------------------------------------- |
| model  | string | Yes      | Target model name (e.g. `llama3.1`, `gemma3`) |
| prompt | string | Yes      | Input prompt                                  |

### Common Optional Fields

| Field      | Type            | Description                                   |
| ---------- | --------------- | --------------------------------------------- |
| stream     | boolean         | Disable streaming when `false`                |
| system     | string          | Override model system prompt                  |
| format     | string | object | `"json"` or JSON schema for structured output |
| raw        | boolean         | Disable Ollama prompt templating              |
| think      | boolean         | Enable thinking output for supported models   |
| keep_alive | string          | Keep model loaded (e.g. `"5m"`, `"0"`)        |
| suffix     | string          | Fill-in-the-middle suffix text                |
| images     | string[]        | Base64 encoded images for multimodal models   |

### Generation Options

Generation parameters are passed inside the `options` object.

| Option            | Type     | Description                        |
| ----------------- | -------- | ---------------------------------- |
| seed              | number   | Deterministic generation seed      |
| temperature       | number   | Sampling temperature               |
| top_k             | number   | Top-k sampling                     |
| top_p             | number   | Top-p sampling                     |
| min_p             | number   | Minimum probability sampling       |
| repeat_penalty    | number   | Token repetition penalty           |
| presence_penalty* | number   | If supported by the selected model |
| num_predict       | number   | Maximum generated tokens           |
| stop              | string[] | Stop sequences                     |

* Availability depends on the model/runtime version.

---

## Request Payload Example

```json
{
  "model": "llama3.1",
  "prompt": "Explain quantum entanglement in one paragraph.",
  "stream": false,
  "options": {
    "seed": 42,
    "temperature": 0.7,
    "min_p": 0.1,
    "top_k": 10
  }
}
```

---

## Parameter Sweep Payload Rule

When performing parameter exploration:

1. Extract static settings from `llm-config`.
2. Generate stepped values via `features/param-calculator`.
3. Create one payload per step.
4. Merge static payload fields with the stepped option value.
5. Place generation controls inside `options`.
6. Set `"stream": false`.
7. Dispatch requests concurrently.
8. Aggregate validated responses.

Example:

```json
{
  "model": "llama3.1",
  "prompt": "...",
  "stream": false,
  "options": {
    "temperature": 0.4
  }
}
```

```json
{
  "model": "llama3.1",
  "prompt": "...",
  "stream": false,
  "options": {
    "temperature": 0.6
  }
}
```

```json
{
  "model": "llama3.1",
  "prompt": "...",
  "stream": false,
  "options": {
    "temperature": 0.8
  }
}
```

---

## Response Contract (Non-Streaming)

```json
{
  "model": "llama3.1",
  "created_at": "2025-01-01T00:00:00Z",
  "response": "Generated text",
  "thinking": "Optional reasoning output",
  "done": true,
  "done_reason": "stop",
  "total_duration": 123456789,
  "load_duration": 1234567,
  "prompt_eval_count": 42,
  "prompt_eval_duration": 1000000,
  "eval_count": 85,
  "eval_duration": 2000000
}
```

### Response Fields

| Field                | Description                             |
| -------------------- | --------------------------------------- |
| model                | Model name                              |
| created_at           | ISO-8601 timestamp                      |
| response             | Generated output                        |
| thinking             | Thinking output (supported models only) |
| done                 | Generation completed                    |
| done_reason          | Stop reason                             |
| total_duration       | Total request duration (ns)             |
| load_duration        | Model load time (ns)                    |
| prompt_eval_count    | Input token count                       |
| prompt_eval_duration | Prompt evaluation time (ns)             |
| eval_count           | Generated token count                   |
| eval_duration        | Token generation time (ns)              |

---

## Parallel Execution Notes

* Requests are dispatched concurrently using `Promise.all(...)`.
* Each request owns a dedicated `AbortController`.
* Controllers are stored in `execution-dispatcher` state.
* Cancellation:

  * Iterate controller collection.
  * Call `.abort()`.
  * Ignore expected abort exceptions.
* Results are aggregated after all promises settle.

---

## Error Handling

### Network Failure

```ts
{
  status: 'error',
  code: 'NETWORK_ERROR',
  message: string
}
```

### Request Aborted

```ts
{
  status: 'cancelled'
}
```

### Invalid Payload

* Validate before dispatch.
* Skip execution.
* Emit lint-style validation error.

### Model/Server Error

```ts
{
  status: 'error',
  code: string,
  message: string
}
```

---

## Payload Transformation Rules

1. Read static configuration from `llm-config`.
2. Calculate stepped values.
3. Build isolated payloads.
4. Store generation parameters inside `options`.
5. Set `stream: false`.
6. Dispatch requests in parallel.
7. Validate returned JSON shape.
8. Aggregate successful and failed results.
9. Preserve original request metadata for traceability.
