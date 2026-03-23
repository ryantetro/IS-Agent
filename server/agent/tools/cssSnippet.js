import { DynamicStructuredTool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { logger } from "../../logger.js";

const cssSnippetSchema = z.object({
  description: z.string().min(5),
  mode: z.enum(["css", "tailwind"]).default("css"),
  constraints: z.string().optional(),
});

function buildCssPrompt({ description, mode, constraints }) {
  return [
    "You are a focused CSS snippet generator.",
    "Return JSON only with fields: mode, code, explanation.",
    `Mode: ${mode}`,
    `Design request: ${description}`,
    constraints ? `Constraints: ${constraints}` : "Constraints: none",
    mode === "tailwind"
      ? "Generate Tailwind class string only in code."
      : "Generate vanilla CSS only in code.",
    "Keep explanation short (1-2 sentences).",
  ].join("\n");
}

export function formatCssSnippetOutput({ mode, code, explanation }) {
  return JSON.stringify({
    mode,
    code: String(code || "").trim(),
    explanation: String(explanation || "").trim(),
  });
}

function fallbackSnippet({ description, mode }) {
  if (mode === "tailwind") {
    return {
      mode,
      code: "rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md",
      explanation: `Tailwind fallback snippet for: ${description}`,
    };
  }

  return {
    mode,
    code: `.card {\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n  background: #ffffff;\n  padding: 1.5rem;\n  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);\n}\n\n.card:hover {\n  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);\n}`,
    explanation: `Vanilla CSS fallback snippet for: ${description}`,
  };
}

async function generateWithModel({ prompt, mode }) {
  if (!process.env.OPENAI_API_KEY) {
    return fallbackSnippet({ description: prompt, mode });
  }

  const model = new ChatOpenAI({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.2,
  });

  const result = await model.invoke(prompt);
  const raw = typeof result.content === "string" ? result.content : JSON.stringify(result.content);
  try {
    const parsed = JSON.parse(raw);
    return {
      mode: parsed.mode || mode,
      code: parsed.code || "",
      explanation: parsed.explanation || "",
    };
  } catch {
    return fallbackSnippet({ description: prompt, mode });
  }
}

export async function executeCssSnippetTool({ input, sessionId = "unknown", llmGenerate }) {
  const startedAt = Date.now();
  logger.info("tool_invocation", { tool: "css_snippet", input, sessionId });

  try {
    const normalized = cssSnippetSchema.parse(input);
    const prompt = buildCssPrompt(normalized);
    const generated = llmGenerate
      ? await llmGenerate({ prompt, mode: normalized.mode })
      : await generateWithModel({ prompt, mode: normalized.mode });

    const output = formatCssSnippetOutput({
      mode: normalized.mode,
      code: generated.code,
      explanation: generated.explanation,
    });

    logger.info("tool_result", {
      tool: "css_snippet",
      input: normalized,
      output,
      durationMs: Date.now() - startedAt,
      sessionId,
    });

    return { tool: "css_snippet", input: normalized, output };
  } catch (error) {
    logger.error("tool_error", {
      tool: "css_snippet",
      input,
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - startedAt,
      sessionId,
    });
    return {
      tool: "css_snippet",
      input,
      output: formatCssSnippetOutput({
        mode: input?.mode || "css",
        code: "",
        explanation: "CSS snippet generation failed.",
      }),
    };
  }
}

export function createCssSnippetLangChainTool({ sessionId = "unknown" } = {}) {
  return new DynamicStructuredTool({
    name: "css_snippet",
    description:
      "Use this only when the user explicitly asks for generated CSS styles or Tailwind classes from a UI/design description.",
    schema: cssSnippetSchema,
    func: async (input) => {
      const result = await executeCssSnippetTool({ input, sessionId });
      return result.output;
    },
  });
}
