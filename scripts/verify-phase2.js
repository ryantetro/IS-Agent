async function main() {
  const { runAgent } = await import("../server/agent/index.js");

  const calculatorRun = await runAgent({
    message: "what is 24 / 6",
    sessionId: "phase2-verify-calc",
  });

  const webSearchRun = await runAgent({
    message: "latest fintech dashboard UI trends",
    sessionId: "phase2-verify-search",
    webSearchFn: async (query) => [
      {
        title: "Mocked Search Result",
        url: "https://example.com/trends",
        content: `Simulated result for: ${query}`,
      },
    ],
  });

  process.stdout.write(
    `${JSON.stringify({
      script: "verify-phase2",
      status: "completed",
      runs: [calculatorRun, webSearchRun],
    })}\n`
  );
}

main().catch((error) => {
  process.stderr.write(
    `${JSON.stringify({
      script: "verify-phase2",
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    })}\n`
  );
  process.exit(1);
});
