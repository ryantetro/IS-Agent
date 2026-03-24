# Architecture — DesignMind

## Overview
DesignMind is a full-stack AI design consultant application with:
- React + Vite frontend
- Express backend
- LangChain.js conversational ReAct path with direct tool fast paths for obvious required-tool prompts
- OpenAI for chat completions and embeddings
- Tavily for web search
- Persistent local JSON embedding store for RAG
- Winston for structured logging

## High-Level Flow
1. User sends a message from the React chat UI.
2. Frontend calls backend `POST /api/chat` or `POST /api/stream`.
3. Backend creates or resumes a session-aware agent run.
4. Backend either fast-paths an obvious tool request or uses the LangChain agent for conversational tool selection.
5. Tool calls emit structured lifecycle events and are logged with structured metadata.
6. Agent returns a structured payload: `text`, `toolsUsed`, `sources`, `artifact`, `toolEvents`, and legacy `response`.
7. Frontend renders text, source attributions, tool chips, code blocks, or artifacts.

## Major Backend Modules
- `server/index.js` — server entrypoint
- `server/app.js` — Express app configuration
- `server/routes/chat.js` — standard chat endpoint
- `server/routes/stream.js` — SSE endpoint with `tool_start`, `tool_end`, `delta`, and `complete`
- `server/agent/index.js` — agent orchestration, tool event capture, and response shaping
- `server/agent/memory.js` — memory/session handling
- `server/agent/tools/*.js` — tool definitions
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
- `client/src/components/ColorSwatchRenderer.jsx` (stretch)
- `client/src/components/CSSPreviewPanel.jsx` (stretch)
- `client/src/hooks/useChat.js`
- `client/src/hooks/useStream.js`
- `client/src/lib/chatPayload.js`

## Memory Strategy
- Session-scoped memory
- In-memory storage keyed by `sessionId` for MVP
- Prior turns are fed back into the agent/UI contract as structured history

## RAG Strategy
- Ingest 5–7 curated design docs
- Chunk with source metadata
- Store embeddings in a persistent local JSON index
- Return structured sources and append a legacy `Sources:` block for compatibility

## Logging Strategy
Log:
- request start/end
- tool call input/output and lifecycle events
- source attribution for RAG
- duration
- errors
- `sessionId` correlation

## CLI Strategy
Provide Node scripts for:
- build
- run
- test
- dev

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
