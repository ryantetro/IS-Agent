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
