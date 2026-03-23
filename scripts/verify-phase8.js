async function main() {
  const { tryParseColorPalette, tryParseCssSnippet } = await import("../client/src/lib/responseParser.js");

  const palettePayload = JSON.stringify({
    type: "color_palette",
    title: "Demo Palette",
    colors: [
      { label: "Primary", hex: "#1E3A5F" },
      { label: "Accent", hex: "#EC4899" },
    ],
  });
  const cssPayload = JSON.stringify({
    mode: "css",
    code: ".card { border-radius: 12px; background: #fff; }",
    explanation: "Simple preview style",
  });

  const palette = tryParseColorPalette(palettePayload);
  const snippet = tryParseCssSnippet(cssPayload);

  process.stdout.write(
    `${JSON.stringify({
      script: "verify-phase8",
      status: "completed",
      paletteDetected: Boolean(palette),
      paletteColorCount: palette?.colors?.length || 0,
      cssDetected: Boolean(snippet),
      cssMode: snippet?.mode || null,
    })}\n`
  );
}

main().catch((error) => {
  process.stderr.write(
    `${JSON.stringify({
      script: "verify-phase8",
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    })}\n`
  );
  process.exit(1);
});
