import { DynamicStructuredTool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";
import { similaritySearch } from "../../rag/vectorStore.js";
import { logger } from "../../logger.js";

const ragSchema = z.object({
  query: z.string().min(3),
});

function canUseLiveOpenAI() {
  return Boolean(process.env.OPENAI_API_KEY) && process.env.DESIGNMIND_OFFLINE_TESTS !== "1";
}

function dedupeSources(sources) {
  const byKey = new Map();
  for (const source of sources || []) {
    const key = `${source.title}::${source.path || source.url || ""}`;
    if (!byKey.has(key)) {
      byKey.set(key, source);
    }
  }
  return [...byKey.values()];
}

function formatSourceLine(source) {
  const title = source.title || source.sourceTitle || "Source";
  const location = source.path || source.sourcePath || source.url || "unavailable";
  return `- ${title} (${location})`;
}

export function formatRagResponse({ answer, sources }) {
  const normalized = dedupeSources(sources);
  const sourceLines = normalized.length ? normalized.map(formatSourceLine).join("\n") : "- unavailable";
  return `${answer}\n\nSources:\n${sourceLines}`;
}

function normalizeSources(matches) {
  return dedupeSources(
    matches.map((match) => ({
      title: match.metadata.sourceTitle,
      path: match.metadata.sourcePath,
      snippet: match.content.slice(0, 280),
    }))
  );
}

function buildFallbackAnswer(query, matches) {
  const snippets = matches
    .map((match) => match.content.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 3);

  if (!snippets.length) {
    return "I could not find relevant design guidance in the local corpus.";
  }

  return `Grounded answer for "${query}":\n\n${snippets.join("\n\n")}`.slice(0, 1200);
}

async function generateGroundedAnswer({ query, matches, modelName }) {
  if (!canUseLiveOpenAI()) {
    return buildFallbackAnswer(query, matches);
  }

  const model = new ChatOpenAI({
    model: modelName || process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0,
  });

  const excerpts = matches
    .map(
      (match, index) =>
        `Source ${index + 1}: ${match.metadata.sourceTitle} (${match.metadata.sourcePath})\n${match.content}`
    )
    .join("\n\n");

  const response = await model.invoke([
    new SystemMessage(
      "You answer design questions only from the provided excerpts. Be concise, grounded, and do not invent sources."
    ),
    new HumanMessage(
      `Question: ${query}\n\nUse only these excerpts:\n\n${excerpts}\n\nProvide a short grounded answer.`
    ),
  ]);

  return typeof response.content === "string"
    ? response.content.trim()
    : JSON.stringify(response.content);
}

export async function executeRagSearchTool({
  input,
  sessionId = "unknown",
  modelName,
}) {
  const startedAt = Date.now();
  logger.info("tool_invocation", { tool: "rag_search", input, sessionId });

  try {
    const matches = await similaritySearch(input, 3);
    const sources = normalizeSources(matches);
    const answer = await generateGroundedAnswer({
      query: input,
      matches,
      modelName,
    });
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

export function createRagLangChainTool({ sessionId = "unknown", modelName } = {}) {
  return new DynamicStructuredTool({
    name: "rag_search",
    description:
      "Use this for questions about design guidelines (Material, Apple HIG, Nielsen Norman, WCAG, Refactoring UI). Always returns sources.",
    schema: ragSchema,
    func: async ({ query }) => {
      const result = await executeRagSearchTool({ input: query, sessionId, modelName });
      return result.output;
    },
  });
}
