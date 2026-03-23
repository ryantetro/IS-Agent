import { evaluate } from "mathjs";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { logger } from "../../logger.js";

const calculatorSchema = z.object({
  expression: z.string().min(1),
});

function normalizeCalculatorResult(value) {
  if (typeof value === "number") {
    return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(8)));
  }
  if (typeof value === "string") {
    return value;
  }
  return JSON.stringify(value);
}

export async function executeCalculatorTool({ input, sessionId = "unknown" }) {
  const startedAt = Date.now();
  logger.info("tool_invocation", { tool: "calculator", input, sessionId });

  try {
    const output = normalizeCalculatorResult(evaluate(input));
    logger.info("tool_result", {
      tool: "calculator",
      input,
      output,
      durationMs: Date.now() - startedAt,
      sessionId,
    });
    return { tool: "calculator", input, output };
  } catch (error) {
    const message = "Invalid calculator expression";
    logger.error("tool_error", {
      tool: "calculator",
      input,
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - startedAt,
      sessionId,
    });
    throw new Error(message);
  }
}

export function createCalculatorLangChainTool({ sessionId = "unknown" } = {}) {
  return new DynamicStructuredTool({
    name: "calculator",
    description:
      "Use this for arithmetic and numeric calculations such as spacing scales, ratios, and layout math.",
    schema: calculatorSchema,
    func: async ({ expression }) => {
      const result = await executeCalculatorTool({ input: expression, sessionId });
      return result.output;
    },
  });
}
