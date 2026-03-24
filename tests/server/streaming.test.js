import test from "node:test";
import assert from "node:assert/strict";
import { streamAgentResponse } from "../../server/agent/index.js";

test("streamAgentResponse forwards tool lifecycle events without fake deltas for tool routes", async () => {
  const chunks = [];
  const events = [];
  const result = await streamAgentResponse({
    message: "Generate tailwind classes for a red CTA button",
    sessionId: "stream-test-1",
    cssSnippetFn: async () => ({
      mode: "tailwind",
      code: "bg-red-600 text-white px-4 py-2 rounded-lg",
      explanation: "CTA styles",
    }),
    onChunk: async (chunk) => {
      chunks.push(chunk);
    },
    onEvent: async (event) => {
      events.push(event.type);
    },
  });

  assert.equal(chunks.length, 0);
  assert.equal(typeof result.response, "string");
  assert.ok(events.includes("tool_start"));
  assert.ok(events.includes("tool_end"));
  assert.ok(!events.includes("delta"));
});
