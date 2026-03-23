import test from "node:test";
import assert from "node:assert/strict";
import { streamAgentResponse } from "../../server/agent/index.js";

test("streamAgentResponse emits progressive chunks and returns final result", async () => {
  const chunks = [];
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
  });

  assert.ok(chunks.length > 1);
  assert.equal(typeof result.response, "string");
  assert.equal(chunks.join(""), result.response);
});
