const { printJson, printError } = require("./_run");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const { runAgent } = await import("../server/agent/index.js");
  const { mapAgentPayload } = await import("../client/src/lib/chatPayload.js");

  const calculator = await runAgent({
    message: "what is 144 / 12",
    sessionId: "assignment-calc",
  });
  assert(calculator.toolsUsed.includes("calculator"), "Calculator tool did not run.");

  const search = await runAgent({
    message: "latest fintech dashboard UI trends",
    sessionId: "assignment-search",
    webSearchFn: async (query) => [
      {
        title: "Mocked Search Result",
        url: "https://example.com/search",
        content: `Search result for ${query}`,
      },
    ],
  });
  assert(search.toolsUsed.includes("web_search"), "Web search tool did not run.");
  assert(search.sources.length > 0, "Web search did not return sources.");

  const rag = await runAgent({
    message: "According to WCAG guidelines, what contrast ratio should normal text use?",
    sessionId: "assignment-rag",
  });
  assert(rag.toolsUsed.includes("rag_search"), "RAG tool did not run.");
  assert(rag.sources.length > 0, "RAG tool did not return sources.");

  await runAgent({
    message: "Generate tailwind classes for a red CTA button",
    sessionId: "assignment-memory",
    cssSnippetFn: async ({ mode }) => ({
      mode,
      code: "bg-red-600 text-white px-4 py-2 rounded-lg",
      explanation: "Initial CTA style",
    }),
  });
  const followUp = await runAgent({
    message: "Use the same color scheme for a card",
    sessionId: "assignment-memory",
    cssSnippetFn: async ({ mode }) => ({
      mode,
      code: "bg-red-600/10 border border-red-200 rounded-xl p-6",
      explanation: "Follow-up style",
    }),
  });
  assert(followUp.toolsUsed.includes("css_snippet"), "Conversation memory follow-up did not route to CSS.");
  assert(/red/i.test(followUp.artifact?.code || ""), "Conversation memory did not preserve CSS context.");

  const mapped = mapAgentPayload(followUp);
  assert(mapped.codeSnippet?.mode === "tailwind", "Client payload mapping lost the CSS artifact.");

  printJson({
    script: "verify-assignment",
    status: "completed",
    checks: ["calculator", "web_search", "rag", "memory", "client_contract"],
  });
}

main().catch((error) => {
  printError({
    script: "verify-assignment",
    status: "error",
    message: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
});
