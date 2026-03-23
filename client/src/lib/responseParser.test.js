import test from "node:test";
import assert from "node:assert/strict";
import { parseSources, stripSources, tryParseColorPalette, tryParseCssSnippet } from "./responseParser.js";

test("tryParseCssSnippet parses css snippet payload", () => {
  const payload = JSON.stringify({
    mode: "tailwind",
    code: "rounded-lg bg-blue-600 px-4 py-2 text-white",
    explanation: "CTA button classes",
  });
  const parsed = tryParseCssSnippet(payload);
  assert.equal(parsed.mode, "tailwind");
  assert.match(parsed.code, /bg-blue-600/);
});

test("parseSources extracts listed sources from response body", () => {
  const content = "Answer text\n\nSources:\n- WCAG (server/rag/docs/wcag.md)\n- Material Design";
  const sources = parseSources(content);
  assert.equal(sources.length, 2);
  assert.match(sources[0], /WCAG/);
});

test("stripSources removes source section from content", () => {
  const content = "Main answer\n\nSources:\n- Source 1";
  assert.equal(stripSources(content), "Main answer");
});

test("tryParseColorPalette parses palette artifact payload", () => {
  const payload = JSON.stringify({
    type: "color_palette",
    title: "Fintech Palette",
    colors: [
      { label: "Primary", hex: "#1E3A5F" },
      { label: "Surface", hex: "#F8FAFC" },
    ],
  });
  const parsed = tryParseColorPalette(payload);
  assert.equal(parsed.type, "color_palette");
  assert.equal(parsed.colors.length, 2);
  assert.equal(parsed.colors[0].label, "Primary");
});
