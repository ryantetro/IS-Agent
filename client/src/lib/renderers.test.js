import test from "node:test";
import assert from "node:assert/strict";
import { formatSourceBadgeLabel, formatToolChipLabel } from "./renderers.js";

test("formatSourceBadgeLabel prefers compact host or filename labels", () => {
  assert.equal(
    formatSourceBadgeLabel({
      title: "WCAG 2.1 Guidelines",
      url: "https://www.w3.org/WAI/WCAG21/quickref/",
    }),
    "w3.org"
  );
});

test("formatToolChipLabel renders readable tool names", () => {
  assert.equal(formatToolChipLabel("rag_search"), "rag search");
});
