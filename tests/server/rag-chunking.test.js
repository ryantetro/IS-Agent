import test from "node:test";
import assert from "node:assert/strict";
import { chunkDocument } from "../../server/rag/chunking.js";

test("chunkDocument splits text and preserves source metadata", () => {
  const text = "A ".repeat(1800);
  const chunks = chunkDocument({
    text,
    sourceTitle: "WCAG 2.1",
    sourcePath: "server/rag/docs/wcag-2.1-guidelines.md",
    chunkSize: 500,
    overlap: 50,
  });

  assert.ok(chunks.length > 1);
  assert.equal(chunks[0].metadata.sourceTitle, "WCAG 2.1");
  assert.equal(chunks[0].metadata.sourcePath, "server/rag/docs/wcag-2.1-guidelines.md");
  assert.equal(chunks[0].metadata.chunkIndex, 0);
  assert.equal(typeof chunks[0].metadata.totalChunks, "number");
});
