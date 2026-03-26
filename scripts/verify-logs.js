const fs = require("node:fs");
const path = require("node:path");
const { printJson, printError } = require("./_run");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const logFilePath = path.join(process.cwd(), "logs", "verify-logs.ndjson");
  fs.rmSync(logFilePath, { force: true });
  process.env.DESIGNMIND_LOG_FILE = logFilePath;

  const { runAgent } = await import("../server/agent/index.js");

  const result = await runAgent({
    message: "Generate tailwind classes for a red CTA button",
    sessionId: "verify-logs-session",
    cssSnippetFn: async ({ mode }) => ({
      mode,
      code: "bg-red-600 text-white px-4 py-2 rounded-lg",
      explanation: "Primary CTA style",
    }),
  });

  await new Promise((resolve) => setTimeout(resolve, 50));

  assert(fs.existsSync(logFilePath), "Expected file-backed log output.");

  const entries = fs
    .readFileSync(logFilePath, "utf8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));

  const requestStart = entries.find((entry) => entry.message === "agent_request_start");
  const requestEnd = entries.find((entry) => entry.message === "agent_request_end");
  const toolResult = entries.find((entry) => entry.message === "tool_result");

  assert(requestStart, "Missing agent_request_start log.");
  assert(requestEnd, "Missing agent_request_end log.");
  assert(toolResult, "Missing tool_result log.");
  assert(typeof requestStart.timestamp === "string", "Start log is missing timestamp.");
  assert(requestStart.sessionId === "verify-logs-session", "Start log is missing session correlation.");
  assert(requestStart.userMessage === "Generate tailwind classes for a red CTA button", "Start log is missing userMessage.");
  assert(Array.isArray(requestEnd.toolCalls), "End log is missing toolCalls.");
  assert(typeof requestEnd.finalResponse === "string" && requestEnd.finalResponse.length > 0, "End log is missing finalResponse.");
  assert(typeof requestEnd.totalDurationMs === "number", "End log is missing totalDurationMs.");

  printJson({
    script: "verify-logs",
    status: "completed",
    logFilePath,
    route: result.route,
    logMessages: entries.map((entry) => entry.message),
  });
}

main().catch((error) => {
  printError({
    script: "verify-logs",
    status: "error",
    message: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
});
