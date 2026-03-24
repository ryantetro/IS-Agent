import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { logger } from "../logger.js";

const memoryStore = new Map();

export function getSessionMemory(sessionId) {
  if (!memoryStore.has(sessionId)) {
    memoryStore.set(sessionId, []);
    logger.info("session_created", { sessionId });
  } else {
    logger.debug("session_reused", { sessionId });
  }
  return memoryStore.get(sessionId);
}

export function getSessionHistory(sessionId) {
  const session = getSessionMemory(sessionId);
  logger.debug("memory_read", { sessionId, turns: session.length });
  return [...session];
}

export function appendSessionTurn(sessionId, turn) {
  const session = getSessionMemory(sessionId);
  session.push({
    role: turn.role,
    content: turn.content,
    timestamp: new Date().toISOString(),
  });
  logger.debug("memory_write", { sessionId, role: turn.role, turns: session.length });
}

export function getMemoryContext(sessionId, limit = 6) {
  const session = getSessionMemory(sessionId);
  const slice = session.slice(-limit);
  return slice.map((turn) => `${turn.role}: ${turn.content}`).join("\n");
}

export function getSessionMessages(sessionId, limit = 8) {
  const session = getSessionMemory(sessionId);
  return session.slice(-limit).map((turn) => {
    if (turn.role === "assistant") {
      return new AIMessage(turn.content);
    }
    return new HumanMessage(turn.content);
  });
}

export function clearSessionMemory(sessionId) {
  memoryStore.delete(sessionId);
}
