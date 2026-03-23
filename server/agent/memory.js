const memoryStore = new Map();

export function getSessionMemory(sessionId) {
  if (!memoryStore.has(sessionId)) {
    memoryStore.set(sessionId, []);
  }
  return memoryStore.get(sessionId);
}
