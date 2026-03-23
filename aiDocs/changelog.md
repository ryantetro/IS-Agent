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

## Format
For future entries include:
- date
- what changed
- why it changed
- test evidence if relevant
- roadmap phase impacted
