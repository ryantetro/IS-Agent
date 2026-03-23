import { DynamicStructuredTool } from "@langchain/core/tools";
import { TavilySearch } from "@langchain/tavily";
import { z } from "zod";
import { logger } from "../../logger.js";

const webSearchSchema = z.object({
  query: z.string().min(3),
});

function formatSearchResults(results) {
  const normalized = Array.isArray(results)
    ? results
    : Array.isArray(results?.results)
      ? results.results
      : [];

  if (normalized.length === 0) {
    return "No web search results found.";
  }

  return normalized
    .slice(0, 3)
    .map((item, index) => `${index + 1}. ${item.title} (${item.url})\n${item.content ?? ""}`)
    .join("\n\n");
}

export async function executeWebSearchTool({
  input,
  sessionId = "unknown",
  webSearchFn,
}) {
  const startedAt = Date.now();
  logger.info("tool_invocation", { tool: "web_search", input, sessionId });

  try {
    const search = webSearchFn
      ? webSearchFn
      : async (query) => {
          if (!process.env.TAVILY_API_KEY) {
            throw new Error("Missing TAVILY_API_KEY");
          }
          const tavily = new TavilySearch({ maxResults: 3 });
          return tavily.invoke({ query });
        };

    const results = await search(input);
    const output = formatSearchResults(results);
    logger.info("tool_result", {
      tool: "web_search",
      input,
      output,
      durationMs: Date.now() - startedAt,
      sessionId,
    });
    return { tool: "web_search", input, output };
  } catch (error) {
    logger.error("tool_error", {
      tool: "web_search",
      input,
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - startedAt,
      sessionId,
    });
    throw error;
  }
}

export function createWebSearchLangChainTool({ sessionId = "unknown", webSearchFn } = {}) {
  return new DynamicStructuredTool({
    name: "web_search",
    description:
      "Use this for current design trends, up-to-date UI examples, and recent design-library information from the web.",
    schema: webSearchSchema,
    func: async ({ query }) => {
      const result = await executeWebSearchTool({ input: query, sessionId, webSearchFn });
      return result.output;
    },
  });
}
