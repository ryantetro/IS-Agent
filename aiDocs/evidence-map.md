# Casey Technical Process Evidence Map

## 1. PRD & Document-Driven Development
- Canonical requirements: `aiDocs/prd.md`
- Implementation bridge: `aiDocs/plan.md`
- High-level roadmap checklist: `aiDocs/roadmap.md`
- Detailed phase archive: `ai/roadmaps/phase-*.md`
- Commit-by-commit archive: `ai/roadmaps/commit-*.md`
- Living history: `aiDocs/changelog.md`, `aiDocs/process-log.md`
- Verification command: `npm run verify:process`
- Core commits: `c2a387c`, `31a1298`, `e67ccbb`

## 2. AI Development Infrastructure
- AI project orientation: `aiDocs/context.md`
- MCP example: `.mcp.example.json`
- MCP setup guide: `aiDocs/mcp-setup.md`
- Cross-platform Node workflow scripts: `scripts/dev.js`, `scripts/build.js`, `scripts/run.js`, `scripts/test.js`
- Repo hygiene: `.gitignore`, `.env.example`
- Branch/commit evidence: `git log --oneline --reverse`
- Core commits: `c2a387c`, `e67ccbb`

## 3. Phase-by-Phase Implementation
- Phase checklist: `aiDocs/roadmap.md`
- Detailed phase docs: `ai/roadmaps/phase-01-project-setup.md` through `ai/roadmaps/phase-09-polish.md`
- Commit docs: `ai/roadmaps/commit-c2a387c-foundation.md` through `ai/roadmaps/commit-e67ccbb-docs-cli-alignment.md`
- Verification scripts: `scripts/verify-phase2.js` through `scripts/verify-phase9.js`
- Git evidence command: `git log --pretty=format:'%h %ad %s' --date=iso --reverse`

## 4. Structured Logging & Debugging
- Shared logger: `server/logger.js`
- Agent end-of-run logging: `server/agent/index.js`
- Deterministic debug replay: `scripts/debug-agent.js`
- Structured log verification: `scripts/verify-logs.js`
- Full verification pipeline: `scripts/test.js`
- Runtime output location: `logs/*.ndjson`
- Validation commands:
  - `npm run verify:logs`
  - `npm run debug:agent`
  - `npm run test`

## Recommended Reviewer Walkthrough
1. Read `aiDocs/prd.md`, `aiDocs/plan.md`, and `aiDocs/roadmap.md`.
2. Open `ai/roadmaps/master-roadmap.md` for the detailed phase/commit archive.
3. Run `npm run verify:process`.
4. Run `npm run verify:logs`.
5. Run `npm run test`.
