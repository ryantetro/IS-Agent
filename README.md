# DesignMind

DesignMind is a LangChain.js ReAct agent project that acts as an AI UI/design consultant.  
This repository follows an AI-first workspace structure with durable docs in `aiDocs/` and AI process artifacts in `ai/`.

## Workspace Layout
- `aiDocs/` tracked shared context, PRD, architecture, style, changelog
- `ai/` local AI planning/research notes (gitignored)
- `client/` React + Vite app scaffold
- `server/` Express + agent scaffolding
- `scripts/` Node-based CLI entrypoints for AI-exercisable workflows
- `tests/` server and integration test folders

## Quick Start
1. Install dependencies per workspace:
   - `npm install --prefix client`
   - `npm install --prefix server`
2. Copy `.env.example` to `.env` and set API keys.
3. Run local workflows:
   - `npm run dev`
   - `npm run build`
   - `npm run test`

## AI Workflow
1. Read `aiDocs/context.md`
2. Read `ai/roadmaps/master-roadmap.md`
3. Implement one phase at a time
4. Update `aiDocs/changelog.md` with major decisions/checkpoints
