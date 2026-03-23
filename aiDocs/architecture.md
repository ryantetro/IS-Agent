# Architecture — DesignMind

## Overview
DesignMind is a full-stack AI design consultant application with:
- React + Vite frontend
- Express backend
- LangChain.js ReAct agent
- OpenAI for chat completions and embeddings
- Tavily for web search
- Chroma as a persistent local vector store
- Winston for structured logging

## High-Level Flow
1. User sends a message from the React chat UI.
2. Frontend calls backend `/api/chat` or `/api/stream`.
3. Backend creates or resumes a session-aware agent run.
4. Agent selects tools (calculator, web search, RAG search, CSS snippet generator).
5. Tool calls are logged with structured metadata.
6. Agent returns final response.
7. Frontend renders text, source attributions, code blocks, or artifacts.

## Major Backend Modules
- `server/index.js` — server entrypoint
- `server/app.js` — Express app configuration
- `server/routes/chat.js` — standard chat endpoint
- `server/routes/stream.js` — streaming endpoint
- `server/agent/index.js` — AgentExecutor / ReAct setup
- `server/agent/memory.js` — memory/session handling
- `server/agent/tools/*.js` — tool definitions
- `server/rag/ingestDocs.js` — chunk/embed/store design docs
- `server/rag/vectorStore.js` — Chroma setup and retrieval
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

## Memory Strategy
- Session-scoped memory
- In-memory storage keyed by `sessionId` for MVP
- Defer persistence until core flow is stable

## RAG Strategy
- Ingest 5–7 curated design docs
- Chunk with source metadata
- Store embeddings in persistent local Chroma
- Return answer with source attribution for each RAG-backed response

## Logging Strategy
Log:
- request start/end
- tool call input/output
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
