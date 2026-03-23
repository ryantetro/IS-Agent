async function main() {
  const { streamAgentResponse } = await import("../server/agent/index.js");

  const chunks = [];
  const result = await streamAgentResponse({
    message: "Generate tailwind classes for a dark navbar with subtle border",
    sessionId: "phase7-stream",
    cssSnippetFn: async () => ({
      mode: "tailwind",
      code: "bg-slate-900 text-white border-b border-slate-700 px-6 py-3",
      explanation: "Navbar classes",
    }),
    onChunk: async (chunk) => {
      chunks.push(chunk);
    },
  });

  process.stdout.write(
    `${JSON.stringify({
      script: "verify-phase7",
      status: "completed",
      chunkCount: chunks.length,
      streamedLength: chunks.join("").length,
      responseLength: result.response.length,
      route: result.route,
    })}\n`
  );
}

main().catch((error) => {
  process.stderr.write(
    `${JSON.stringify({
      script: "verify-phase7",
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    })}\n`
  );
  process.exit(1);
});
