import test from "node:test";
import assert from "node:assert/strict";
import { createStreamRouter } from "../../server/routes/stream.js";

test("POST /api/stream emits structured SSE events", async () => {
  const router = createStreamRouter({
    streamAgentResponseImpl: async ({ onEvent }) => {
      await onEvent?.({ type: "tool_start", tool: "web_search", input: "latest trends" });
      await onEvent?.({ type: "tool_end", tool: "web_search", input: "latest trends", outputPreview: "done" });
      await onEvent?.({ type: "delta", text: "Hello " });
      await onEvent?.({ type: "delta", text: "world" });
      return {
        sessionId: "stream-route",
        route: "react_agent",
        text: "Hello world",
        toolsUsed: ["web_search"],
        sources: [],
        artifact: null,
        toolEvents: [],
        response: "Hello world",
      };
    },
  });

  const req = {
    method: "POST",
    url: "/",
    body: { message: "latest trends?" },
  };

  const body = await new Promise((resolve, reject) => {
    let written = "";
    const res = {
      statusCode: 200,
      setHeader() {},
      flushHeaders() {},
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        reject(new Error(`Unexpected json response: ${JSON.stringify(payload)}`));
      },
      write(chunk) {
        written += chunk;
      },
      end() {
        resolve(written);
      },
    };
    router.handle(req, res, reject);
  });

  assert.match(body, /event: start/);
  assert.match(body, /event: tool_start/);
  assert.match(body, /event: tool_end/);
  assert.match(body, /event: delta/);
  assert.match(body, /event: complete/);
});
