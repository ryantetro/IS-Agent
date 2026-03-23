import test from "node:test";
import assert from "node:assert/strict";
import { formatCssSnippetOutput, executeCssSnippetTool } from "../../server/agent/tools/cssSnippet.js";

test("formatCssSnippetOutput returns predictable structure", () => {
  const formatted = formatCssSnippetOutput({
    mode: "css",
    code: ".card { border-radius: 12px; }",
    explanation: "Rounded card style.",
  });

  const parsed = JSON.parse(formatted);
  assert.equal(parsed.mode, "css");
  assert.match(parsed.code, /card/);
  assert.match(parsed.explanation, /Rounded/);
});

test("executeCssSnippetTool supports tailwind mode", async () => {
  const result = await executeCssSnippetTool({
    input: {
      description: "Primary button with subtle hover animation",
      mode: "tailwind",
    },
    sessionId: "css-test",
    llmGenerate: async () => ({
      mode: "tailwind",
      code: "inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 transition-colors",
      explanation: "Tailwind button snippet.",
    }),
  });

  const parsed = JSON.parse(result.output);
  assert.equal(parsed.mode, "tailwind");
  assert.match(parsed.code, /bg-blue-600/);
});
