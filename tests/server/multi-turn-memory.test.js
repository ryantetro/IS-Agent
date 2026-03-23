import test from "node:test";
import assert from "node:assert/strict";
import { runAgent } from "../../server/agent/index.js";
import { clearSessionMemory } from "../../server/agent/memory.js";

test("agent uses prior session context for follow-up css request", async () => {
  const sessionId = "memory-integration-1";
  clearSessionMemory(sessionId);

  await runAgent({
    sessionId,
    message: "Generate tailwind classes for a red CTA button",
    cssSnippetFn: async ({ prompt, mode }) => ({
      mode,
      code: prompt.includes("red") ? "bg-red-600 text-white px-4 py-2 rounded-lg" : "bg-blue-600",
      explanation: "Initial style",
    }),
  });

  const followUp = await runAgent({
    sessionId,
    message: "Use the same color scheme for a card",
    cssSnippetFn: async ({ prompt, mode }) => ({
      mode,
      code: prompt.includes("bg-red-600")
        ? "bg-red-600/10 border border-red-200 rounded-xl p-6"
        : "bg-blue-600/10",
      explanation: "Follow-up style",
    }),
  });

  assert.equal(followUp.route, "css_snippet");
  assert.match(followUp.response, /red-600/);
});
