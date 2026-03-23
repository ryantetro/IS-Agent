const fs = require("node:fs");
const path = require("node:path");

function exists(relativePath) {
  return fs.existsSync(path.join(process.cwd(), relativePath));
}

function main() {
  const requiredPaths = [
    "aiDocs/context.md",
    "aiDocs/prd.md",
    "aiDocs/roadmap.md",
    "README.md",
    ".gitignore",
    "server/logger.js",
    "server/agent/tools/calculator.js",
    "server/agent/tools/webSearch.js",
    "server/agent/tools/ragSearch.js",
    "server/agent/memory.js",
    "client/src/App.jsx",
  ];

  const missing = requiredPaths.filter((entry) => !exists(entry));
  if (missing.length) {
    process.stderr.write(
      `${JSON.stringify({
        script: "verify-phase9",
        status: "error",
        message: "Missing required assignment files",
        missing,
      })}\n`
    );
    process.exit(1);
  }

  process.stdout.write(
    `${JSON.stringify({
      script: "verify-phase9",
      status: "completed",
      checks: "assignment repo requirements verified (excluding demo video)",
    })}\n`
  );
}

main();
