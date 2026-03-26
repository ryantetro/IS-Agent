# DesignMind Implementation Plan

## Purpose
This document is the bridge between the PRD and implementation. The PRD defines what DesignMind must do; this plan defines how the repo should move from requirements to phased delivery.

## Source-of-Truth Order
1. `aiDocs/prd.md`
2. `aiDocs/plan.md`
3. `aiDocs/roadmap.md`
4. `ai/roadmaps/phase-*.md`
5. `ai/roadmaps/commit-*.md`
6. implementation, tests, and changelog updates

## Delivery Strategy
- Start with repo scaffolding, environment rules, and structured logging.
- Implement the four required capabilities incrementally: calculator, web search, RAG, and CSS generation.
- Add conversation memory only after tool routing is stable.
- Add the React UI after the backend contract is stable.
- Layer streaming and artifact rendering as stretch phases.
- Keep every phase accompanied by a verification script or focused test evidence.

## Phase Plan

### Phase 1
- Establish the monorepo layout, initial docs, root scripts, and ignore rules.
- Create the baseline logger and API skeleton.

### Phase 2
- Implement calculator and web search.
- Add routing heuristics, route tests, and phase verification.

### Phase 3
- Ingest the design corpus and persist a local JSON embedding index.
- Require structured source attribution in RAG responses.

### Phase 4
- Add structured CSS/Tailwind generation with deterministic response shape.

### Phase 5
- Add session-scoped memory and verify same-session follow-up behavior.

### Phase 6
- Connect the React UI to the structured backend response contract.

### Phase 7
- Add streaming with explicit lifecycle events.

### Phase 8
- Add artifact rendering for color swatches and CSS preview.

### Phase 9
- Tighten repo hygiene, verification coverage, and submission-facing documentation.
- Backfill reviewer-visible process artifacts so the repo shows how the work was developed, not just the final code.

## Acceptance Criteria
- The PRD remains stable enough that implementation can be traced back to it.
- Each roadmap phase has clear exit criteria and verification evidence.
- The repo shows meaningful incremental progress in git history.
- Logs, tests, and docs all describe the same shipped behavior.
- Reviewer-facing evidence is tracked in git, while scratch AI notes remain local-only.
