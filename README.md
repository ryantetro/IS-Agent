# DesignMind

DesignMind is a multi-tool LangChain.js design assistant with a React web UI, structured tool metadata, and a source-aware RAG workflow.

## Assignment Deliverable Summary

- Calculator tool (`mathjs`) for design math
- Web search tool (Tavily)
- RAG tool over 5+ real design docs with source attribution
- Session-scoped conversation memory
- React chat web UI (primary interaction path)
- Streaming responses via SSE with structured `tool_start`, `tool_end`, `delta`, and `complete` events
- Artifact rendering for color swatches and CSS preview (stretch complete)

## Repository Requirements Mapping

- `context.md`: `aiDocs/context.md`
- PRD: `aiDocs/prd.md`
- Roadmap (tracked): `aiDocs/roadmap.md`
- `.gitignore`: root `.gitignore` excludes secrets/artifacts
- Structured logging: `server/logger.js` + tool/agent/stream logs
- Incremental history: setup -> tools -> RAG -> CSS -> memory -> UI -> streaming (7+ commits)

## Project Structure

- `client/`: React + Vite web app
- `server/`: Express API + agent/tool modules
- `server/rag/docs/`: source documents for ingestion
- `scripts/`: cross-platform verification and workflow scripts
- `aiDocs/`: tracked project context, requirements, roadmap, architecture, changelog
- `tests/`: server and parser-level tests

## Environment

Put secrets in **`.env`** and/or **`.env.local` at the repository root** (next to the root `package.json`). The API loads both files on startup (`server/loadEnv.js`); **`.env.local` overrides `.env`**.

Set:

- `OPENAI_API_KEY` — required for live grounded answering, CSS generation, and real-time agent/tool runs
- `TAVILY_API_KEY` — required when the agent calls `web_search`
- `RUN_LIVE_AGENT_TESTS=1` — optional, enables `npm run test:live`
- `PORT` (optional, default `3001`)

**Note:** `.env.local` is for local overrides (and is gitignored). It was not read by Node until `loadEnv.js` was added—only Vite reads it for the client by default.

## Run Locally

Install dependencies:

- `npm install --prefix client`
- `npm install --prefix server`

**Recommended — one command (API + Vite):**

- From the **repo root**: `npm run dev`  
  This starts the Express API on port **3001**, waits for `/health`, then starts Vite. The client proxies `/api/*` to `http://127.0.0.1:3001` (IPv4 avoids common `AggregateError` / proxy failures with `localhost`).

**Optional env (root `npm run dev`):**

- `PORT` or `API_PORT` — API port (default `3001`). If you change it, set `VITE_API_PROXY` when starting Vite, e.g. `VITE_API_PROXY=http://127.0.0.1:4000 npm --prefix client run dev`.

**Two terminals instead:**

- Terminal 1: `npm run run` (API only)
- Terminal 2: `npm --prefix client run dev` (Vite only)

If you run **only** `npm --prefix client run dev` without the API, Vite will log `http proxy error` for `/api/*` — start the server first.

## Verification Commands

- Server tests: `npm run test --prefix server`
- Client tests: `npm run test --prefix client`
- Build checks: `npm run build`
- Full verification pipeline: `npm run test`
- Assignment smoke test: `npm run verify:assignment`
- Live provider verification: `RUN_LIVE_AGENT_TESTS=1 npm run test:live`

Phase scripts (called by `npm run test`):

- `scripts/verify-phase2.js`
- `scripts/verify-phase3.js`
- `scripts/verify-phase4.js`
- `scripts/verify-phase5.js`
- `scripts/verify-phase6.js`
- `scripts/verify-phase7.js`
- `scripts/verify-phase8.js`

## API Endpoints

- `POST /api/chat`: structured chat response with `text`, `toolsUsed`, `sources`, `artifact`, `toolEvents`, and legacy `response`
- `POST /api/stream`: SSE stream with `start`, `tool_start`, `tool_end`, `delta`, `complete`, and `error`
- `GET /api/stream`: compatibility alias for SSE consumers still using query params
- `GET /health`: health check

## Notes

- The RAG store is a persisted local JSON embedding index, not Chroma.
- `npm run test` forces offline mode so local verification stays deterministic even if keys exist on the machine.
- Demo video is intentionally not included in repo (submission artifact).
- Temporary local source markdown copies at repo root are not required by runtime; canonical RAG corpus is in `server/rag/docs/`.
