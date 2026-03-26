const fs = require("node:fs");
const path = require("node:path");
const { printJson, printError } = require("./_run");

async function main() {
  const logFilePath = path.join(process.cwd(), "logs", "debug-agent.ndjson");
  fs.rmSync(logFilePath, { force: true });

  process.env.DESIGNMIND_LOG_FILE = logFilePath;

  const { runAgent } = await import("../server/agent/index.js");
  const sessionId = "debug-agent-session";

  const first = await runAgent({
    message: "Generate tailwind classes for a red CTA button",
    sessionId,
    cssSnippetFn: async ({ mode }) => ({
      mode,
      code: "bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-500",
      explanation: "Primary CTA style for the debug run.",
    }),
  });

  const second = await runAgent({
    message: "Use the same color scheme for a card",
    sessionId,
    cssSnippetFn: async ({ prompt, mode }) => ({
      mode,
      code: prompt.includes("bg-red-600")
        ? "rounded-2xl border border-red-200 bg-red-50 p-6 text-slate-900"
        : "rounded-2xl border border-slate-200 bg-white p-6 text-slate-900",
      explanation: "Follow-up card style for the debug run.",
    }),
  });

  await new Promise((resolve) => setTimeout(resolve, 50));

  const lines = fs
    .readFileSync(logFilePath, "utf8")
    .trim()
    .split("\n")
    .filter(Boolean);

  printJson({
    script: "debug-agent",
    status: "completed",
    sessionId,
    logFilePath,
    logLines: lines.length,
    routes: [first.route, second.route],
    toolsUsed: [first.toolsUsed, second.toolsUsed],
  });
}

main().catch((error) => {
  printError({
    script: "debug-agent",
    status: "error",
    message: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
});
