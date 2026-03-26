# DesignMind Roadmap (Tracked)

This is the reviewer-facing high-level roadmap. Detailed phase and commit artifacts live in `ai/roadmaps/`.

## Phase 1 — Project Setup & Infrastructure
- [x] Repo scaffolded with `client/`, `server/`, `scripts/`, and `tests/`
- [x] Environment template and ignore rules configured
- [x] Initial docs (`context`, `prd`, `architecture`, `coding-style`, `changelog`) added
- [x] Structured logging scaffolded
- [x] Detailed roadmap: `ai/roadmaps/phase-01-project-setup.md`

## Phase 2 — Core Tools (Calculator + Web Search)
- [x] Calculator tool implemented
- [x] Tavily web search tool implemented
- [x] Agent routing added
- [x] Tool-call logging, structured tool events, and route validation added
- [x] Detailed roadmap: `ai/roadmaps/phase-02-core-tools.md`

## Phase 3 — RAG Tool
- [x] 5 design docs curated and ingested
- [x] Persistent local embedding store path implemented
- [x] RAG retrieval with structured source attribution implemented
- [x] Persistence/retrieval verified
- [x] Detailed roadmap: `ai/roadmaps/phase-03-rag.md`

## Phase 4 — CSS Snippet Tool
- [x] CSS/Tailwind generation schema + prompt path implemented
- [x] Tool routing and logging integrated
- [x] Validation coverage added
- [x] Detailed roadmap: `ai/roadmaps/phase-04-css-snippet.md`

## Phase 5 — Conversation Memory
- [x] Session-scoped in-memory conversation history implemented
- [x] Multi-turn follow-up behavior verified
- [x] Detailed roadmap: `ai/roadmaps/phase-05-memory.md`

## Phase 6 — Web UI (React Chat)
- [x] React chat interface implemented
- [x] `/api/chat` structured payload integration complete
- [x] Tool indicators, source badges, and code rendering added
- [x] Detailed roadmap: `ai/roadmaps/phase-06-web-ui.md`

## Phase 7 — Streaming
- [x] SSE endpoint added (`/api/stream`)
- [x] Structured stream events (`tool_start`, `tool_end`, `delta`, `complete`) implemented
- [x] Completion/error flow handled
- [x] Detailed roadmap: `ai/roadmaps/phase-07-streaming.md`

## Phase 8 — Artifact Renderer
- [x] Color palette swatch rendering added
- [x] CSS preview panel rendering added
- [ ] Optional dynamic font loading not implemented
- [x] Detailed roadmap: `ai/roadmaps/phase-08-artifact-rendering.md`

## Phase 9 — Polish & Submission
- [x] README expanded with setup, architecture, and verification flow
- [x] Assignment requirement cross-check completed (except video recording)
- [x] Repo hygiene checked (secrets/logs/vector DB ignored)
- [x] Offline and live verification scripts split (`npm test`, `npm run test:live`)
- [x] Process backfill added: plan, evidence map, process log, MCP example, phase roadmaps, and commit roadmaps
- [ ] Record and attach 2-minute demo video
- [x] Detailed roadmap: `ai/roadmaps/phase-09-polish.md`
