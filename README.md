# DesignMind

DesignMind is a multi-tool LangChain.js design assistant with a React web UI, structured tool metadata, a source-aware RAG workflow, and reviewer-visible process artifacts for PRD-driven development.

## Assignment Deliverable Summary

- Calculator tool (`mathjs`) for design math
- Web search tool (Tavily)
- RAG tool over 5+ real design docs with source attribution
- Session-scoped conversation memory
- React chat web UI (primary interaction path)
- Streaming responses via SSE with structured `tool_start`, `tool_end`, `delta`, and `complete` events
- Artifact rendering for color swatches and CSS preview
- Structured JSON logging to stdout and `logs/*.ndjson`

## Repository Requirements Mapping

- `context.md`: `aiDocs/context.md`
- PRD: `aiDocs/prd.md`
- Plan: `aiDocs/plan.md`
- High-level roadmap: `aiDocs/roadmap.md`
- Detailed phase + commit roadmaps: `ai/roadmaps/`
- Process log: `aiDocs/process-log.md`
- Evidence map: `aiDocs/evidence-map.md`
- MCP setup example: `.mcp.example.json` + `aiDocs/mcp-setup.md`
- Structured logging: `server/logger.js`
- Incremental history: setup -> tools -> RAG -> CSS -> memory -> UI -> streaming -> docs/process alignment

## Project Structure

- `client/`: React + Vite web app
- `server/`: Express API + agent/tool modules
- `server/rag/docs/`: source documents for ingestion
- `scripts/`: cross-platform verification, debug, and workflow scripts
- `aiDocs/`: canonical tracked requirements, plan, process, architecture, and evidence docs
- `ai/roadmaps/`: tracked detailed phase-by-phase and commit-by-commit implementation archive
- `tests/`: server and parser-level tests
- `logs/`: ignored structured runtime/debug logs (`*.ndjson`)

## Process Evidence

The repo is organized around a document-driven pipeline:

1. `aiDocs/prd.md` defines the product and grading-critical requirements.
2. `aiDocs/plan.md` translates the PRD into an implementation strategy.
3. `aiDocs/roadmap.md` tracks the shipped phases at a reviewer-friendly level.
4. `ai/roadmaps/` contains detailed backfilled artifacts for each phase and each meaningful commit.
5. `aiDocs/process-log.md` and `aiDocs/evidence-map.md` show how the work evolved across sessions and where to verify it.

## Environment

Put secrets in **`.env`** and/or **`.env.local` at the repository root** (next to the root `package.json`). The API loads both files on startup (`server/loadEnv.js`); **`.env.local` overrides `.env`**.

Set:

- `OPENAI_API_KEY` — required for live grounded answering, CSS generation, and real-time agent/tool runs
- `TAVILY_API_KEY` — required when the agent calls `web_search`
- `RUN_LIVE_AGENT_TESTS=1` — optional, enables `npm run test:live`
- `PORT` — optional API port override (default `3001`)
- `DESIGNMIND_LOG_FILE` — optional override for the NDJSON log output path

## Run Locally

Install dependencies:

- `npm install --prefix client`
- `npm install --prefix server`

Recommended:

- From the repo root: `npm run dev`

This starts the Express API on port `3001`, waits for `/health`, then starts Vite. The client proxies `/api/*` to `http://127.0.0.1:3001`.

Optional env:

- `PORT` or `API_PORT` — API port override
- `VITE_API_PROXY` — client proxy target if you run Vite separately

Two-terminal option:

- Terminal 1: `npm run run`
- Terminal 2: `npm --prefix client run dev`

## Verification Commands

- Server tests: `npm run test --prefix server`
- Client tests: `npm run test --prefix client`
- Build checks: `npm run build`
- Full verification pipeline: `npm run test`
- Assignment smoke test: `npm run verify:assignment`
- Process artifact verification: `npm run verify:process`
- Structured log verification: `npm run verify:logs`
- Deterministic debug replay: `npm run debug:agent`
- Live provider verification: `RUN_LIVE_AGENT_TESTS=1 npm run test:live`

Phase scripts called by `npm run test`:

- `scripts/verify-phase2.js`
- `scripts/verify-phase3.js`
- `scripts/verify-phase4.js`
- `scripts/verify-phase5.js`
- `scripts/verify-phase6.js`
- `scripts/verify-phase7.js`
- `scripts/verify-phase8.js`
- `scripts/verify-phase9.js`
- `scripts/verify-logs.js`
- `scripts/verify-process-docs.js`

## API Endpoints

- `POST /api/chat`: structured chat response with `text`, `toolsUsed`, `sources`, `artifact`, `toolEvents`, and legacy `response`
- `POST /api/stream`: SSE stream with `start`, `tool_start`, `tool_end`, `delta`, `complete`, and `error`
- `GET /api/stream`: compatibility alias for SSE consumers still using query params
- `GET /health`: health check

## Notes

- The RAG store is a persisted local JSON embedding index, not Chroma.
- Structured logs are emitted to stdout and appended to `logs/*.ndjson`.
- `npm run test` forces offline mode so local verification stays deterministic even if keys exist on the machine.
- Demo video is intentionally not included in repo because it is a submission artifact rather than runtime code.
