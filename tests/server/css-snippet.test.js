import test from "node:test";
import assert from "node:assert/strict";
import {
  executeCssSnippetTool,
  formatCssSnippetOutput,
  inferCssMode,
} from "../../server/agent/tools/cssSnippet.js";

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

test("inferCssMode chooses html for copy-pasteable component requests", () => {
  assert.equal(
    inferCssMode("Build me a simple pricing card component using HTML and Tailwind"),
    "html"
  );
  assert.equal(inferCssMode("Generate tailwind classes for a pricing card"), "tailwind");
});

test("executeCssSnippetTool preserves request metadata for html components", async () => {
  const result = await executeCssSnippetTool({
    input: {
      description: "Build a pricing card component using HTML and Tailwind",
      mode: "html",
    },
    sessionId: "css-html-test",
    llmGenerate: async () => ({
      mode: "html",
      code: '<section class="rounded-3xl bg-white p-8 shadow-xl"><h2>Pro</h2><p>$24/month</p></section>',
      explanation: "Pricing card component.",
    }),
  });

  assert.equal(result.artifact?.mode, "html");
  assert.match(result.artifact?.code || "", /section/);
  assert.match(result.artifact?.request || "", /pricing card component/i);
});
