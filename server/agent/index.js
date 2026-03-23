import { ChatOpenAI } from "@langchain/openai";
import { logger } from "../logger.js";
import { executeCalculatorTool, createCalculatorLangChainTool } from "./tools/calculator.js";
import { executeWebSearchTool, createWebSearchLangChainTool } from "./tools/webSearch.js";
import { executeRagSearchTool, createRagLangChainTool } from "./tools/ragSearch.js";
import { executeCssSnippetTool, createCssSnippetLangChainTool } from "./tools/cssSnippet.js";

let cachedExecutor = null;

function looksLikeMath(message) {
  return /(\d+\s*[\+\-\*\/]\s*\d+)|calculate|what is \d+/i.test(message);
}

function looksLikeRagQuery(message) {
  return /(wcag|material design|apple hig|nielsen|heuristic|refactoring ui|guideline)/i.test(message);
}

function looksLikeCssRequest(message) {
  return /(tailwind|css|class(es)?|styles?|hover|button|card|layout|snippet)/i.test(message);
}

async function runDeterministicFallback({ message, sessionId, webSearchFn, cssSnippetFn }) {
  if (looksLikeMath(message)) {
    const expression = message.replace(/[^0-9+\-*/(). ]/g, "").trim() || message;
    const result = await executeCalculatorTool({ input: expression, sessionId });
    return {
      sessionId,
      route: "calculator",
      toolsUsed: ["calculator"],
      response: result.output,
    };
  }

  if (looksLikeRagQuery(message)) {
    const ragResult = await executeRagSearchTool({ input: message, sessionId });
    return {
      sessionId,
      route: "rag_search",
      toolsUsed: ["rag_search"],
      response: ragResult.output,
    };
  }

  if (looksLikeCssRequest(message)) {
    const mode = /tailwind/i.test(message) ? "tailwind" : "css";
    const cssResult = await executeCssSnippetTool({
      input: { description: message, mode },
      sessionId,
      llmGenerate: cssSnippetFn,
    });
    return {
      sessionId,
      route: "css_snippet",
      toolsUsed: ["css_snippet"],
      response: cssResult.output,
    };
  }

  const webResult = await executeWebSearchTool({
    input: message,
    sessionId,
    webSearchFn,
  });
  return {
    sessionId,
    route: "web_search",
    toolsUsed: ["web_search"],
    response: webResult.output,
  };
}

async function getAgentExecutor({ sessionId, webSearchFn }) {
  if (cachedExecutor) {
    return cachedExecutor;
  }
  const { AgentExecutor, createReactAgent } = await import("langchain/agents");

  const model = new ChatOpenAI({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0,
  });

  const tools = [
    createCalculatorLangChainTool({ sessionId }),
    createWebSearchLangChainTool({ sessionId, webSearchFn }),
    createRagLangChainTool({ sessionId }),
    createCssSnippetLangChainTool({ sessionId }),
  ];

  const prompt = `You are DesignMind phase-4 agent.
Use calculator for arithmetic.
Use web_search for current trends and live web references.
Use rag_search for local design-guideline questions.
Use css_snippet only when the user asks for generated CSS or Tailwind code from a design description.
Keep final answers concise and preserve structured tool outputs.`;
  const agent = await createReactAgent({ llm: model, tools, prompt });
  cachedExecutor = new AgentExecutor({ agent, tools, verbose: false });
  return cachedExecutor;
}

export async function runAgent({ message, sessionId = "default", webSearchFn, cssSnippetFn }) {
  const startedAt = Date.now();
  logger.info("agent_request_start", { sessionId, userMessage: message });

  try {
    let result;
    if (!process.env.OPENAI_API_KEY) {
      result = await runDeterministicFallback({ message, sessionId, webSearchFn, cssSnippetFn });
    } else {
      const executor = await getAgentExecutor({ sessionId, webSearchFn });
      const response = await executor.invoke({ input: message });
      result = {
        sessionId,
        route: "react_agent",
        toolsUsed: ["calculator", "web_search", "rag_search", "css_snippet"],
        response: typeof response.output === "string" ? response.output : JSON.stringify(response.output),
      };
    }

    logger.info("agent_request_end", {
      sessionId,
      route: result.route,
      toolsUsed: result.toolsUsed,
      durationMs: Date.now() - startedAt,
    });
    return result;
  } catch (error) {
    logger.error("agent_request_error", {
      sessionId,
      userMessage: message,
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - startedAt,
    });
    throw error;
  }
}
