import test from "node:test";
import assert from "node:assert/strict";
import { formatRagResponse } from "../../server/agent/tools/ragSearch.js";

test("formatRagResponse always includes Sources block", () => {
  const output = formatRagResponse({
    answer: "Use high contrast for readability.",
    sources: [
      {
        sourceTitle: "WCAG 2.1 Guidelines",
        sourcePath: "server/rag/docs/wcag-2.1-guidelines.md",
      },
    ],
  });

  assert.match(output, /Sources:/);
  assert.match(output, /WCAG 2.1 Guidelines/);
});
