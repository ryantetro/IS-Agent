import test from "node:test";
import assert from "node:assert/strict";
import { applyToolEventToDraft, mapAgentPayload } from "./chatPayload.js";

test("mapAgentPayload prefers structured sources and CSS artifacts", () => {
  const mapped = mapAgentPayload({
    text: "Generated a button.",
    toolsUsed: ["css_snippet"],
    sources: [
      {
        title: "WCAG 2.1 Guidelines",
        path: "server/rag/docs/wcag-2.1-guidelines.md",
        snippet: "4.5:1 for normal text",
      },
    ],
    artifact: {
      type: "css_snippet",
      mode: "tailwind",
      code: "bg-red-500 text-white",
      explanation: "Red CTA button.",
      request: "Generate a pricing card component",
    },
  });

  assert.equal(mapped.text, "Generated a button.");
  assert.equal(mapped.sources[0].title, "WCAG 2.1 Guidelines");
  assert.equal(mapped.codeSnippet.mode, "tailwind");
  assert.match(mapped.codeSnippet.request, /pricing card/i);
});

test("applyToolEventToDraft shows progress text for tool starts", () => {
  const updated = applyToolEventToDraft(
    {
      text: "Thinking...",
      toolsUsed: [],
      toolEvents: [],
    },
    {
      type: "tool_start",
      tool: "web_search",
    }
  );

  assert.equal(updated.text, "Using web search...");
  assert.deepEqual(updated.toolsUsed, ["web_search"]);
  assert.equal(updated.toolEvents.length, 1);
});
