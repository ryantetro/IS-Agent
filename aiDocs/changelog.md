# Changelog — DesignMind

## 2026-03-23
- Initialized professor-style AI-first repo structure
- Moved project docs into `aiDocs/` and `ai/roadmaps/`
- Added `.cursorrules` as local AI instruction file
- Added initial architecture and coding style docs
- Added script scaffolding plan for AI-exercisable workflows
- Implemented Phase 2 core logic for calculator + web search tools
- Added LangChain ReAct agent wiring with deterministic fallback when API keys are unavailable
- Added structured logging for agent request start/end, tool invocation/result, and tool/agent errors
- Added server tests for calculator behavior and phase-2 routing verification
- Added `scripts/verify-phase2.js` and integrated it into root test workflow
- Verification evidence: `npm run test` passes with server unit tests and CLI phase-2 validation output
- Implemented Phase 3 RAG slice with local persistent vector storage in `chroma_db/rag-store.json`
- Added ingestion pipeline (`server/rag/ingestDocs.js`) that loads 5 curated design docs, chunks content, and stores retrievable records
- Added `rag_search` tool with async retrieval and mandatory `Sources:` attribution block in every response
- Wired `rag_search` into agent routing and ReAct tool registration
- Added RAG-focused tests for chunk metadata and source-format guarantees
- Added `scripts/verify-phase3.js` and integrated it into root test workflow to validate ingestion, retrieval, and persistence behavior
- Verification evidence: `npm run test --prefix server`, `node scripts/verify-phase3.js`, and `npm run test` all pass
- Implemented Phase 4 `css_snippet` tool with focused prompt design and structured JSON output (`mode`, `code`, `explanation`)
- Added support for both `css` and `tailwind` generation modes with explicit schema validation
- Added tool-level try/catch handling and structured logging for invocation/result/error events
- Wired `css_snippet` into agent routing and ReAct tool list with explicit guidance on when it should be used
- Added tests and CLI validation for CSS/Tailwind generation paths
- Added `scripts/verify-phase4.js` and integrated it into root test workflow
- Verification evidence: `npm run test --prefix server`, `node scripts/verify-phase4.js`, and `npm run test` all pass
- Implemented Phase 5 session-scoped conversation memory in `server/agent/memory.js`
- Added structured memory lifecycle logs for session creation/reuse and memory read/write operations
- Wired memory context into agent execution to support follow-up prompts that depend on prior turns
- Added multi-turn validation for same-session follow-up behavior and session memory unit coverage
- Added `scripts/verify-phase5.js` and integrated it into root test workflow
- Verification evidence: `npm run test --prefix server`, `node scripts/verify-phase5.js`, and `npm run test` all pass
- Implemented Phase 6 React chat UI connected to `/api/chat` with message history and send flow
- Added UI components for chat window, message list/input, tool indicators, source badges, and syntax-highlighted code blocks with copy support
- Added client response parsing for source extraction and CSS snippet rendering modes
- Added loading and error UI states for request handling
- Added frontend verification script `scripts/verify-phase6.js` and integrated it into root test workflow
- Verification evidence: `npm run test --prefix client`, `npm run build --prefix client`, `node scripts/verify-phase6.js`, and `npm run test` all pass
- Implemented Phase 7 streaming endpoint at `/api/stream` using SSE event contract (`start`, `chunk`, `complete`, `fail`)
- Added streaming helper in agent flow to emit progressive chunks while preserving existing non-streaming behavior
- Updated client chat flow to consume stream chunks progressively and render assistant output incrementally
- Kept non-streaming `/api/chat` fallback path for resilience when stream fails
- Added structured logs for stream start, chunk emission, completion, and stream errors
- Added streaming verification script `scripts/verify-phase7.js` and integrated it into root test workflow
- Verification evidence: `npm run test --prefix server`, `npm run test --prefix client`, `node scripts/verify-phase7.js`, and `npm run test` all pass

## Format
For future entries include:
- date
- what changed
- why it changed
- test evidence if relevant
- roadmap phase impacted
