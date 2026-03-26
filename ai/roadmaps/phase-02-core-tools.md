# Phase 02 — Core Tools

- Status: Finalized
- Source quality: Reconstructed from commit `4de8558`, tests, and changelog
- PRD linkage: sections 4.1, 4.2, 7, and 8

## Goal
Ship the two required baseline tools: calculator and web search, with reliable routing and structured tool logging.

## Planned Tasks
- Implement calculator tool using `mathjs`
- Implement Tavily-backed web search tool
- Add routing heuristics and route tests
- Add phase verification script

## Completion Checklist
- [x] Calculator tool implemented
- [x] Web search tool implemented
- [x] Routing tests added
- [x] `scripts/verify-phase2.js` added

## Files / Systems Touched
- `server/agent/index.js`
- `server/agent/tools/calculator.js`
- `server/agent/tools/webSearch.js`
- `tests/server/agent-routing.test.js`
- `tests/server/calculator.test.js`

## Validation Commands
- `node scripts/verify-phase2.js`
- `npm run test --prefix server`

## Logs / Tests Reviewed
- Calculator tool logs
- Web search tool logs
- Route selection behavior in `agent-routing.test.js`

## Completion Evidence
- Commit: `4de8558`
- Follow-on work unlocked: RAG, CSS tool, and memory
