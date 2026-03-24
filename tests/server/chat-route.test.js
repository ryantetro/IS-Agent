import test from "node:test";
import assert from "node:assert/strict";
import { createChatRouter } from "../../server/routes/chat.js";

test("POST /api/chat returns the structured agent payload", async () => {
  const router = createChatRouter({
    runAgentImpl: async () => ({
      sessionId: "route-session",
      route: "react_agent",
      text: "Grounded answer",
      toolsUsed: ["rag_search"],
      sources: [
        {
          title: "WCAG 2.1 Guidelines",
          path: "server/rag/docs/wcag-2.1-guidelines.md",
          snippet: "Normal text should meet 4.5:1 contrast.",
        },
      ],
      artifact: null,
      toolEvents: [{ type: "tool_start", tool: "rag_search", input: "contrast ratio" }],
      response:
        "Grounded answer\n\nSources:\n- WCAG 2.1 Guidelines (server/rag/docs/wcag-2.1-guidelines.md)",
    }),
  });

  const req = {
    method: "POST",
    url: "/",
    body: { message: "contrast ratio?" },
  };

  const payload = await new Promise((resolve, reject) => {
    const res = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        resolve({ statusCode: this.statusCode, body: data });
      },
    };
    router.handle(req, res, reject);
  });

  assert.equal(payload.statusCode, 200);
  assert.equal(payload.body.route, "react_agent");
  assert.equal(payload.body.text, "Grounded answer");
  assert.equal(payload.body.toolsUsed[0], "rag_search");
  assert.equal(payload.body.sources[0].title, "WCAG 2.1 Guidelines");
});
