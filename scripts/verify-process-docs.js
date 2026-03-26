const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");
const { printJson, printError } = require("./_run");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function exists(relativePath) {
  return fs.existsSync(path.join(process.cwd(), relativePath));
}

function main() {
  const phaseRoadmaps = [
    "ai/roadmaps/phase-01-project-setup.md",
    "ai/roadmaps/phase-02-core-tools.md",
    "ai/roadmaps/phase-03-rag.md",
    "ai/roadmaps/phase-04-css-snippet.md",
    "ai/roadmaps/phase-05-memory.md",
    "ai/roadmaps/phase-06-web-ui.md",
    "ai/roadmaps/phase-07-streaming.md",
    "ai/roadmaps/phase-08-artifact-rendering.md",
    "ai/roadmaps/phase-09-polish.md",
  ];

  const commitRoadmaps = [
    "ai/roadmaps/commit-c2a387c-foundation.md",
    "ai/roadmaps/commit-4de8558-phase-2-tools.md",
    "ai/roadmaps/commit-657b553-phase-3-rag.md",
    "ai/roadmaps/commit-59d479f-phase-4-css.md",
    "ai/roadmaps/commit-cb7a348-phase-5-memory.md",
    "ai/roadmaps/commit-51d02d5-phase-6-ui.md",
    "ai/roadmaps/commit-e7936eb-phase-7-streaming.md",
    "ai/roadmaps/commit-31a1298-phase-8-9-polish.md",
    "ai/roadmaps/commit-e67ccbb-docs-cli-alignment.md",
  ];

  const requiredPaths = [
    ".mcp.example.json",
    "aiDocs/plan.md",
    "aiDocs/process-log.md",
    "aiDocs/evidence-map.md",
    "aiDocs/mcp-setup.md",
    "ai/roadmaps/README.md",
    "ai/roadmaps/master-roadmap.md",
    ...phaseRoadmaps,
    ...commitRoadmaps,
  ];

  const missing = requiredPaths.filter((entry) => !exists(entry));
  assert(!missing.length, `Missing required process docs: ${missing.join(", ")}`);

  const cursorLogStatuses = execSync("git status --short -- .cursor/debug-*.log", {
    cwd: process.cwd(),
    encoding: "utf8",
  })
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const blockingCursorLogs = cursorLogStatuses.filter((line) => !line.startsWith("D "));
  assert(blockingCursorLogs.length === 0, "Tracked .cursor debug logs should be removed.");

  const mcpConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), ".mcp.example.json"), "utf8"));
  assert(
    mcpConfig && typeof mcpConfig === "object" && mcpConfig.mcpServers && Object.keys(mcpConfig.mcpServers).length >= 1,
    "Expected at least one MCP server in .mcp.example.json."
  );

  printJson({
    script: "verify-process-docs",
    status: "completed",
    phaseRoadmaps: phaseRoadmaps.length,
    commitRoadmaps: commitRoadmaps.length,
    trackedCursorLogs: blockingCursorLogs.length,
  });
}

try {
  main();
} catch (error) {
  printError({
    script: "verify-process-docs",
    status: "error",
    message: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
}
