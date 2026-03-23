export function tryParseCssSnippet(content) {
  if (typeof content !== "string") return null;
  try {
    const parsed = JSON.parse(content);
    if (
      parsed &&
      (parsed.mode === "css" || parsed.mode === "tailwind") &&
      typeof parsed.code === "string"
    ) {
      return {
        mode: parsed.mode,
        code: parsed.code,
        explanation: parsed.explanation || "",
      };
    }
  } catch {
    return null;
  }
  return null;
}

function isHex(value) {
  return typeof value === "string" && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

export function tryParseColorPalette(content) {
  if (typeof content !== "string") return null;
  try {
    const parsed = JSON.parse(content);
    if (!parsed || parsed.type !== "color_palette" || !Array.isArray(parsed.colors)) {
      return null;
    }
    const colors = parsed.colors
      .map((color) => ({
        label: typeof color?.label === "string" ? color.label : "Color",
        hex: typeof color?.hex === "string" ? color.hex.trim() : "",
      }))
      .filter((color) => isHex(color.hex));

    if (!colors.length) return null;
    return {
      type: "color_palette",
      title: typeof parsed.title === "string" ? parsed.title : "Generated Palette",
      colors,
    };
  } catch {
    return null;
  }
}

export function parseSources(content) {
  if (typeof content !== "string" || !content.includes("Sources:")) {
    return [];
  }
  const sourceSection = content.split("Sources:")[1] || "";
  return sourceSection
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim())
    .filter(Boolean);
}

export function stripSources(content) {
  if (typeof content !== "string") return "";
  if (!content.includes("Sources:")) return content;
  return content.split("Sources:")[0].trim();
}
