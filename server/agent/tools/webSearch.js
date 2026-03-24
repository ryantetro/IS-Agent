import { tavily } from "@tavily/core";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { logger } from "../../logger.js";

const SEARCH_TIMEOUT_MS = 12000;

const webSearchSchema = z.object({
  query: z.string().min(3),
});

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Search timed out after ${ms}ms`)), ms);
    }),
  ]);
}

function normalizeResults(raw) {
  if (Array.isArray(raw)) {
    return { answer: "", results: raw };
  }
  return {
    answer: typeof raw?.answer === "string" ? raw.answer.trim() : "",
    results: Array.isArray(raw?.results) ? raw.results : [],
  };
}

function toSources(results) {
  return results.slice(0, 5).map((item) => ({
    title: item.title || item.url || "Web result",
    path: item.url || "",
    url: item.url || "",
    snippet: item.content || "",
  }));
}

function formatSearchResults(results) {
  if (!results.length) {
    return "No web search results found.";
  }

  return results
    .slice(0, 5)
    .map((item, index) => `${index + 1}. ${item.title} (${item.url})\n${item.content ?? ""}`)
    .join("\n\n");
}

function formatTavilySearchResponse({ answer, results }) {
  const sections = [];
  if (answer) {
    sections.push(`Answer: ${answer}`);
  }
  sections.push(formatSearchResults(results));
  return sections.filter(Boolean).join("\n\n");
}

export async function executeWebSearchTool({ input, sessionId = "unknown", webSearchFn }) {
  const startedAt = Date.now();
  logger.info("tool_invocation", { tool: "web_search", input, sessionId });

  try {
    const search = webSearchFn
      ? webSearchFn
      : async (query) => {
          if (!process.env.TAVILY_API_KEY) {
            throw new Error("Missing TAVILY_API_KEY");
          }
          const client = tavily({ apiKey: process.env.TAVILY_API_KEY });
          return client.search(query, {
            maxResults: 5,
            searchDepth: "basic",
            includeAnswer: true,
          });
        };

    const raw = await withTimeout(search(input), SEARCH_TIMEOUT_MS);
    const normalized = normalizeResults(raw);
    const output = formatTavilySearchResponse(normalized);
    const sources = toSources(normalized.results);

    logger.info("tool_result", {
      tool: "web_search",
      input,
      output,
      sources,
      durationMs: Date.now() - startedAt,
      sessionId,
    });
    return { tool: "web_search", input, output, sources };
  } catch (error) {
    const output =
      "Web search is temporarily unavailable. I could not reach Tavily or the request timed out.";
    logger.error("tool_error", {
      tool: "web_search",
      input,
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - startedAt,
      sessionId,
    });
    return { tool: "web_search", input, output, sources: [] };
  }
}

export function createWebSearchLangChainTool({ sessionId = "unknown", webSearchFn } = {}) {
  return new DynamicStructuredTool({
    name: "web_search",
    description:
      "Use this for current design trends, up-to-date UI examples, and recent design-library information from the web. Uses Tavily search.",
    schema: webSearchSchema,
    func: async ({ query }) => {
      const result = await executeWebSearchTool({ input: query, sessionId, webSearchFn });
      return result.output;
    },
  });
}
