# Architecture — DesignMind

## Overview
DesignMind is a full-stack AI design consultant application with:
- React + Vite frontend
- Express backend
- LangChain.js conversational agent flow with direct tool fast paths for obvious required-tool prompts
- OpenAI for chat completions and embeddings
- Tavily for web search
- Persistent local JSON embedding store for RAG
- Shared JSON logger that writes to stdout and `logs/*.ndjson`

## High-Level Flow
1. User sends a message from the React chat UI.
2. Frontend calls backend `POST /api/chat` or `POST /api/stream`.
3. Backend creates or resumes a session-aware agent run.
4. Backend either fast-paths an obvious tool request or uses the LangChain agent for conversational tool selection.
5. Tool calls emit structured lifecycle events and structured logs.
6. Agent returns a structured payload: `text`, `toolsUsed`, `sources`, `artifact`, `toolEvents`, and legacy `response`.
7. Frontend renders text, source attributions, tool chips, code blocks, or artifacts.

## Major Backend Modules
- `server/index.js` — server entrypoint
- `server/app.js` — Express app configuration
- `server/routes/chat.js` — standard chat endpoint
- `server/routes/stream.js` — SSE endpoint with `tool_start`, `tool_end`, `delta`, and `complete`
- `server/agent/index.js` — agent orchestration, tool event capture, response shaping, and final request logging
- `server/agent/memory.js` — session memory handling
- `server/agent/tools/*.js` — calculator, web search, RAG, and CSS tool definitions
- `server/rag/ingestDocs.js` — chunk/embed/store design docs
- `server/rag/vectorStore.js` — JSON embedding store bootstrap and similarity search
- `server/logger.js` — shared structured logger

## Major Frontend Modules
- `client/src/App.jsx` — app shell
- `client/src/components/ChatWindow.jsx`
- `client/src/components/MessageList.jsx`
- `client/src/components/MessageInput.jsx`
- `client/src/components/ToolIndicator.jsx`
- `client/src/components/SourceBadge.jsx`
- `client/src/components/CodeBlock.jsx`
- `client/src/components/ColorSwatchRenderer.jsx`
- `client/src/components/CSSPreviewPanel.jsx`
- `client/src/hooks/useChat.js`
- `client/src/hooks/useStream.js`
- `client/src/lib/chatPayload.js`

## Memory Strategy
- Session-scoped memory
- In-memory storage keyed by `sessionId` for MVP
- Prior turns are fed back into the agent/tool routing flow as structured history

## RAG Strategy
- Ingest 5 curated design docs under `server/rag/docs/`
- Chunk with source metadata
- Store embeddings in a persistent local JSON index under `chroma_db/rag-store.json`
- Return structured sources and append a compatibility `Sources:` block when needed

## Logging Strategy
Each run emits:
- `agent_request_start` with `sessionId`, `userMessage`, selected model, and runtime tag
- tool-level invocation/result/error entries
- stream start/complete/error events when SSE is used
- `agent_request_end` with `toolCalls`, `finalResponse`, `sources`, and `totalDurationMs`

Logs are emitted as newline-delimited JSON to stdout and appended to `logs/*.ndjson`.

## CLI Strategy
Provide Node scripts for:
- build
- run
- test
- dev
- verify process artifacts
- verify structured logs
- deterministic debug replay

Scripts must be AI-readable:
- JSON stdout
- structured stderr
- proper exit codes

## Non-Goals for v1
- auth
- team collaboration
- cloud deployment complexity
- image generation
- mobile optimization
