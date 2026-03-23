const { spawn } = require("node:child_process");

function runIngest() {
  return new Promise((resolve, reject) => {
    const child = spawn("npm", ["run", "rag:ingest", "--prefix", "server"], {
      stdio: "inherit",
      shell: true,
    });
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error("rag ingest failed"))));
  });
}

async function main() {
  const { runAgent } = await import("../server/agent/index.js");
  const { getVectorStore } = await import("../server/rag/vectorStore.js");
  await runIngest();

  const first = await runAgent({
    message: "According to WCAG guidelines, what contrast ratio should normal text use?",
    sessionId: "phase3-rag-first",
  });
  const beforeRestart = await getVectorStore();

  // Simulate restart by re-running ingest and querying again from disk-backed store.
  await runIngest();
  const second = await runAgent({
    message: "What does Material Design suggest about elevation?",
    sessionId: "phase3-rag-second",
  });
  const afterRestart = await getVectorStore();

  process.stdout.write(
    `${JSON.stringify({
      script: "verify-phase3",
      status: "completed",
      beforeRestart,
      afterRestart,
      runs: [first, second],
    })}\n`
  );
}

main().catch((error) => {
  process.stderr.write(
    `${JSON.stringify({
      script: "verify-phase3",
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    })}\n`
  );
  process.exit(1);
});
