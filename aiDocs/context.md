# context.md — DesignMind Project Orientation

## What This Project Is
DesignMind is a multi-tool AI agent built with LangChain.js that acts as a professional UI/design consultant. It uses calculator, web search, RAG over design docs, CSS generation, structured logging, and session memory through a chat interface.

## Critical Files To Review
- `aiDocs/prd.md`
- `aiDocs/plan.md`
- `aiDocs/roadmap.md`
- `aiDocs/process-log.md`
- `aiDocs/evidence-map.md`
- `aiDocs/architecture.md`
- `aiDocs/mcp-setup.md`
- `ai/roadmaps/README.md`
- `ai/roadmaps/master-roadmap.md`

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Agent: LangChain.js conversational agent with deterministic tool fast paths for obvious calculator/RAG/search/CSS prompts
- Models: OpenAI chat + embeddings
- Vector store: persisted local JSON embedding index
- Search: Tavily
- Logging: shared JSON logger that writes to stdout and `logs/*.ndjson`

## Important Notes
- `aiDocs/` is the canonical tracked project narrative.
- `ai/roadmaps/` is the tracked detailed implementation archive.
- Everything else inside `ai/` should be treated as local scratch space.
- Prefer Node.js scripts in `scripts/` so workflows are cross-platform and AI-exercisable.
- Scripts should return JSON to stdout and structured errors to stderr with proper exit codes.
- Never commit `.env`, `.testEnvVars`, runtime `logs/`, or `chroma_db/`.

## Current Focus
- Keep the structured server/client contract (`text`, `toolsUsed`, `sources`, `artifact`, `toolEvents`) aligned across routes, UI, and tests.
- Keep process artifacts reviewer-visible and synchronized with the shipped codebase.
- Preserve deterministic offline verification while keeping a separate live-provider verification path.
