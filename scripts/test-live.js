const { printJson, printError } = require("./_run");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  await import("../server/loadEnv.js");

  if (process.env.RUN_LIVE_AGENT_TESTS !== "1" && process.env.RUN_LIVE_AGENT_TESTS !== "true") {
    printJson({
      script: "test-live",
      status: "skipped",
      reason: "Set RUN_LIVE_AGENT_TESTS=1 to enable live OpenAI/Tavily verification.",
    });
    return;
  }

  if (!process.env.OPENAI_API_KEY || !process.env.TAVILY_API_KEY) {
    throw new Error("OPENAI_API_KEY and TAVILY_API_KEY are required for live verification.");
  }

  const { runAgent } = await import("../server/agent/index.js");

  const math = await runAgent({
    message: "what is 2 + 2",
    sessionId: "live-test-math",
  });
  assert(math.toolsUsed.includes("calculator"), "Live math run did not report calculator usage.");
  assert(/4/.test(math.text), "Live math run did not return the expected answer.");

  const rag = await runAgent({
    message: "According to WCAG, what contrast ratio should normal text use?",
    sessionId: "live-test-rag",
  });
  assert(rag.toolsUsed.includes("rag_search"), "Live RAG run did not report rag_search usage.");
  assert(rag.sources.length > 0, "Live RAG run did not include sources.");
  assert(/Sources:/i.test(rag.response), "Live RAG run did not include a legacy Sources block.");

  const search = await runAgent({
    message: "What are the latest 2026 dashboard UI trends?",
    sessionId: "live-test-search",
  });
  assert(search.toolsUsed.includes("web_search"), "Live search run did not report web_search usage.");
  assert(search.sources.length > 0, "Live search run did not include structured sources.");

  const css = await runAgent({
    message: "Generate tailwind classes for a red CTA button",
    sessionId: "live-test-css",
  });
  assert(css.toolsUsed.includes("css_snippet"), "Live CSS run did not report css_snippet usage.");
  assert(css.artifact?.type === "css_snippet", "Live CSS run did not return a CSS artifact.");
  assert(css.artifact?.mode === "tailwind", "Live CSS run did not preserve tailwind mode.");

  await runAgent({
    message: "Generate tailwind classes for a red CTA button",
    sessionId: "live-test-memory",
  });
  const memoryFollowUp = await runAgent({
    message: "Use the same color scheme for a card",
    sessionId: "live-test-memory",
  });
  assert(
    memoryFollowUp.toolsUsed.includes("css_snippet"),
    "Live memory follow-up did not trigger the CSS tool."
  );
  assert(/red/i.test(memoryFollowUp.artifact?.code || ""), "Live memory follow-up did not preserve the color scheme.");

  printJson({
    script: "test-live",
    status: "completed",
    checks: ["calculator", "rag", "web_search", "css_snippet", "memory_follow_up"],
  });
}

main().catch((error) => {
  printError({
    script: "test-live",
    status: "error",
    message: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
});
