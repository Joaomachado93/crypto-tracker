
---

### 🧠 2. AI_USAGE.md (obrigatório)
O desafio pede um ficheiro onde documentas **como usaste IA** (Cursor, ChatGPT, Copilot, etc.).

Cria `AI_USAGE.md` com este formato:

```markdown
# AI Usage Report

## Tools Used
- ChatGPT (GPT-5)
- Cursor IDE with inline suggestions

## Purpose
- Set up Tailwind configuration
- Generate WebSocket composable (useBinanceSocket)
- Write unit tests for composables
- Fix reconnection logic and Vitest setup

## Effective Prompts
> “Create a Vue 3 composable that connects to Binance WebSocket streams and handles reconnection gracefully.”

> “Write Vitest unit tests for a WebSocket composable without installing extra plugins.”

## Validation
- Manually verified console output from WebSocket connections
- Tested disconnection and reconnection manually
- Validated price data against Binance web dashboard

## Challenges
- Infinite timer loop during Vitest mock tests
- Handling lifecycle hooks outside Vue component context
