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
