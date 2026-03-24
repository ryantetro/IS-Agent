import test from "node:test";
import assert from "node:assert/strict";
import { buildPreviewDocument } from "./componentPreview.js";

test("buildPreviewDocument renders pricing-card scaffolds for tailwind snippets", () => {
  const preview = buildPreviewDocument({
    mode: "tailwind",
    code: "rounded-3xl border border-slate-200 bg-white p-8 shadow-xl",
    request: "Build me a pricing card component using Tailwind",
  });

  assert.match(preview.srcDoc, /Creator Suite/);
  assert.match(preview.srcDoc, /Start free trial/);
  assert.doesNotMatch(preview.srcDoc, /Preview Element/);
});

test("buildPreviewDocument keeps html component markup intact", () => {
  const preview = buildPreviewDocument({
    mode: "html",
    code: '<section class="rounded-3xl bg-white p-8 shadow-xl"><h2>Pro</h2><p>$24/month</p></section>',
    request: "Pricing card component",
  });

  assert.match(preview.srcDoc, /<section class=/);
  assert.match(preview.srcDoc, /\$24/);
});
