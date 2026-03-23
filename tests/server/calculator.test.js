import test from "node:test";
import assert from "node:assert/strict";
import { executeCalculatorTool } from "../../server/agent/tools/calculator.js";

test("calculator tool evaluates arithmetic expression", async () => {
  const result = await executeCalculatorTool({
    input: "8 * 1.5",
    sessionId: "test-session",
  });

  assert.equal(result.tool, "calculator");
  assert.equal(result.output, "12");
});

test("calculator tool rejects invalid expression", async () => {
  await assert.rejects(
    executeCalculatorTool({
      input: "not-valid-expression",
      sessionId: "test-session",
    }),
    /invalid calculator expression/i
  );
});
