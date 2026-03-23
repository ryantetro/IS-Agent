import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { similaritySearch } from "../../rag/vectorStore.js";
import { logger } from "../../logger.js";

const ragSchema = z.object({
  query: z.string().min(3),
});

export function formatRagResponse({ answer, sources }) {
  const unique = [];
  for (const source of sources || []) {
    const label = `${source.sourceTitle} (${source.sourcePath})`;
    if (!unique.includes(label)) unique.push(label);
  }
  const sourceLines = unique.length ? unique.map((s) => `- ${s}`).join("\n") : "- unavailable";
  return `${answer}\n\nSources:\n${sourceLines}`;
}

export async function executeRagSearchTool({ input, sessionId = "unknown" }) {
  const startedAt = Date.now();
  logger.info("tool_invocation", { tool: "rag_search", input, sessionId });

  try {
    const matches = await similaritySearch(input, 3);
    if (!matches.length) {
      const output = formatRagResponse({
        answer: "I could not find relevant design guidance in the local corpus.",
        sources: [],
      });
      logger.warn("tool_result", {
        tool: "rag_search",
        input,
        output,
        durationMs: Date.now() - startedAt,
        sessionId,
      });
      return { tool: "rag_search", input, output, sources: [] };
    }

    const answer = matches
      .map((match) => match.content.slice(0, 300))
      .join("\n\n")
      .slice(0, 1200);
    const sources = matches.map((m) => m.metadata);
    const output = formatRagResponse({ answer, sources });

    logger.info("tool_result", {
      tool: "rag_search",
      input,
      output,
      sources,
      durationMs: Date.now() - startedAt,
      sessionId,
    });
    return { tool: "rag_search", input, output, sources };
  } catch (error) {
    const output = formatRagResponse({
      answer: "RAG retrieval failed. Please try again after re-ingesting documents.",
      sources: [],
    });
    logger.error("tool_error", {
      tool: "rag_search",
      input,
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - startedAt,
      sessionId,
    });
    return { tool: "rag_search", input, output, sources: [] };
  }
}

export function createRagLangChainTool({ sessionId = "unknown" } = {}) {
  return new DynamicStructuredTool({
    name: "rag_search",
    description:
      "Use this for questions about design guidelines (Material, Apple HIG, Nielsen Norman, WCAG, Refactoring UI). Always returns sources.",
    schema: ragSchema,
    func: async ({ query }) => {
      const result = await executeRagSearchTool({ input: query, sessionId });
      return result.output;
    },
  });
}
