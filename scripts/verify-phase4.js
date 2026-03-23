async function main() {
  const { runAgent } = await import("../server/agent/index.js");

  const cssRun = await runAgent({
    message: "Generate CSS for a modern card with soft border and hover shadow",
    sessionId: "phase4-css",
    cssSnippetFn: async () => ({
      mode: "css",
      code: ".card { border: 1px solid #e2e8f0; border-radius: 12px; }",
      explanation: "Base card style.",
    }),
  });

  const tailwindRun = await runAgent({
    message: "Generate tailwind classes for a primary button with subtle hover",
    sessionId: "phase4-tailwind",
    cssSnippetFn: async () => ({
      mode: "tailwind",
      code: "rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 transition-colors",
      explanation: "Primary button utility classes.",
    }),
  });

  process.stdout.write(
    `${JSON.stringify({
      script: "verify-phase4",
      status: "completed",
      runs: [cssRun, tailwindRun],
    })}\n`
  );
}

main().catch((error) => {
  process.stderr.write(
    `${JSON.stringify({
      script: "verify-phase4",
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    })}\n`
  );
  process.exit(1);
});
