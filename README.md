# DesignMind

DesignMind is a multi-tool LangChain.js ReAct agent with a React web UI for design support tasks.

## Assignment Deliverable Summary

- Calculator tool (`mathjs`) for design math
- Web search tool (Tavily)
- RAG tool over 5+ real design docs with source attribution
- Session-scoped conversation memory
- React chat web UI (primary interaction path)
- Streaming responses via SSE (stretch complete)
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

Copy `.env.example` to `.env` and set:

- `OPENAI_API_KEY`
- `TAVILY_API_KEY`
- `PORT` (optional, defaults in server)

## Run Locally

Install dependencies:

- `npm install --prefix client`
- `npm install --prefix server`

Start backend:

- `npm run run`

Start frontend (separate terminal):

- `npm run dev`

Frontend runs through Vite and proxies `/api/*` to the backend.

## Verification Commands

- Server tests: `npm run test --prefix server`
- Client tests: `npm run test --prefix client`
- Build checks: `npm run build`
- Full verification pipeline: `npm run test`

Phase scripts (called by `npm run test`):

- `scripts/verify-phase2.js`
- `scripts/verify-phase3.js`
- `scripts/verify-phase4.js`
- `scripts/verify-phase5.js`
- `scripts/verify-phase6.js`
- `scripts/verify-phase7.js`
- `scripts/verify-phase8.js`

## API Endpoints

- `POST /api/chat`: non-stream chat response
- `GET /api/stream`: SSE stream (`start`, `chunk`, `complete`, `fail`)
- `GET /health`: health check

## Notes

- Demo video is intentionally not included in repo (submission artifact).
- Temporary local source markdown copies at repo root are not required by runtime; canonical RAG corpus is in `server/rag/docs/`.
