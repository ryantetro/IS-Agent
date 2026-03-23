import test from "node:test";
import assert from "node:assert/strict";
import {
  appendSessionTurn,
  clearSessionMemory,
  getSessionHistory,
  getSessionMemory,
} from "../../server/agent/memory.js";

test("session memory creates and stores per-session history", () => {
  const sessionId = "memory-unit-1";
  clearSessionMemory(sessionId);
  getSessionMemory(sessionId);
  appendSessionTurn(sessionId, { role: "user", content: "hello" });
  appendSessionTurn(sessionId, { role: "assistant", content: "hi there" });

  const history = getSessionHistory(sessionId);
  assert.equal(history.length, 2);
  assert.equal(history[0].role, "user");
  assert.equal(history[1].role, "assistant");
});
