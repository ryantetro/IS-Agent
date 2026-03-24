import test from "node:test";
import assert from "node:assert/strict";
import { runAgent } from "../../server/agent/index.js";

test("agent routes obvious math queries to calculator", async () => {
  const result = await runAgent({
    message: "what is 2 + 2",
    sessionId: "routing-test-1",
  });

  assert.equal(result.route, "calculator");
  assert.equal(result.toolsUsed[0], "calculator");
  assert.match(result.response, /4/);
});

test("agent routes design trend queries to web search", async () => {
  const result = await runAgent({
    message: "latest dashboard design trends 2025",
    sessionId: "routing-test-2",
    webSearchFn: async (query) => [
      { title: "Design Trends", url: "https://example.com", content: `Result for ${query}` },
    ],
  });

  assert.equal(result.route, "web_search");
  assert.equal(result.toolsUsed[0], "web_search");
  assert.match(result.response, /Design Trends/);
});

test("agent routes styling prompts to css snippet tool", async () => {
  const result = await runAgent({
    message: "Generate tailwind classes for a card with soft shadow",
    sessionId: "routing-test-3",
    cssSnippetFn: async () => ({
      mode: "tailwind",
      code: "rounded-xl bg-white p-6 shadow-sm",
      explanation: "Simple card style.",
    }),
  });

  assert.equal(result.route, "css_snippet");
  assert.equal(result.toolsUsed[0], "css_snippet");
  assert.match(result.response, /tailwind/i);
});

test("agent routes component prompts to html component generation", async () => {
  const result = await runAgent({
    message: "Build me a simple pricing card component using HTML and Tailwind",
    sessionId: "routing-test-4",
    cssSnippetFn: async () => ({
      mode: "html",
      code: '<section class="rounded-3xl bg-white p-8 shadow-xl"><h2>Pro</h2><p>$24/month</p></section>',
      explanation: "Pricing card component.",
    }),
  });

  assert.equal(result.route, "css_snippet");
  assert.equal(result.toolsUsed[0], "css_snippet");
  assert.equal(result.artifact?.mode, "html");
  assert.match(result.artifact?.code || "", /section/);
});
