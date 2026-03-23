# context.md — DesignMind Project Orientation

## What This Project Is
DesignMind is a multi-tool AI agent built with LangChain.js that acts as a professional UI/design consultant. It uses calculator, web search, RAG over design docs, CSS generation, and memory through a chat interface.

## Critical Files To Review
- `aiDocs/prd.md`
- `aiDocs/architecture.md`
- `aiDocs/coding-style.md`
- `aiDocs/changelog.md`
- `ai/roadmaps/master-roadmap.md`

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Agent: LangChain.js ReAct pattern
- Models: OpenAI chat + embeddings
- Vector store: Chroma (persistent local)
- Search: Tavily
- Logging: Winston

## Important Notes
- Shared, durable project knowledge belongs in `aiDocs/`.
- Temporary AI process artifacts belong in `ai/` and are gitignored.
- Prefer Node.js scripts in `scripts/` so workflows are cross-platform and AI-exercisable.
- Scripts should return JSON to stdout and structured errors to stderr with proper exit codes.
- Never commit `.env`, `.testEnvVars`, `logs/`, or `chroma_db/`.

## Current Focus
- Keep repo aligned with professor AI-first structure.
- Implement roadmap phases incrementally, with test evidence and changelog updates.
