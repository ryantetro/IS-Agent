async function main() {
  const { runAgent } = await import("../server/agent/index.js");
  const sessionId = "phase5-memory";

  const first = await runAgent({
    sessionId,
    message: "Generate tailwind classes for a red CTA button",
    cssSnippetFn: async ({ prompt, mode }) => ({
      mode,
      code: prompt.includes("red") ? "bg-red-600 text-white px-4 py-2 rounded-lg" : "bg-blue-600",
      explanation: "Initial CTA style",
    }),
  });

  const second = await runAgent({
    sessionId,
    message: "Use the same color scheme for a card",
    cssSnippetFn: async ({ prompt, mode }) => ({
      mode,
      code: prompt.includes("bg-red-600")
        ? "bg-red-600/10 border border-red-200 rounded-xl p-6"
        : "bg-blue-600/10",
      explanation: "Follow-up style",
    }),
  });

  const third = await runAgent({
    sessionId,
    message: "Now make that palette darker",
    cssSnippetFn: async ({ prompt, mode }) => ({
      mode,
      code: prompt.includes("red-600")
        ? "bg-red-700 text-white px-4 py-2 rounded-lg"
        : "bg-slate-800 text-white",
      explanation: "Darker variant",
    }),
  });

  process.stdout.write(
    `${JSON.stringify({
      script: "verify-phase5",
      status: "completed",
      sessionId,
      runs: [first, second, third],
    })}\n`
  );
}

main().catch((error) => {
  process.stderr.write(
    `${JSON.stringify({
      script: "verify-phase5",
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    })}\n`
  );
  process.exit(1);
});
