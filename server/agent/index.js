import { ChatOpenAI } from "@langchain/openai";
import { logger } from "../logger.js";
import { executeCalculatorTool, createCalculatorLangChainTool } from "./tools/calculator.js";
import { executeWebSearchTool, createWebSearchLangChainTool } from "./tools/webSearch.js";
import { executeRagSearchTool, createRagLangChainTool } from "./tools/ragSearch.js";
import { executeCssSnippetTool, createCssSnippetLangChainTool } from "./tools/cssSnippet.js";
import { appendSessionTurn, getMemoryContext } from "./memory.js";

let cachedExecutor = null;

function looksLikeMath(message) {
  return /(\d+\s*[\+\-\*\/]\s*\d+)|calculate|what is \d+/i.test(message);
}

function looksLikeRagQuery(message) {
  return /(wcag|material design|apple hig|nielsen|heuristic|refactoring ui|guideline)/i.test(message);
}

function looksLikeCssRequest(message) {
  return /(tailwind|css|class(es)?|styles?|hover|button|card|layout|snippet|palette)/i.test(message);
}

function enrichWithMemory({ message, memoryContext }) {
  if (!memoryContext) {
    return message;
  }
  const isFollowUp = /(same|darker|lighter|that|previous|follow-up|use it|use the same)/i.test(message);
  if (!isFollowUp) {
    return message;
  }
  return `${message}\n\nContext from memory:\n${memoryContext}`;
}

async function runDeterministicFallback({
  message,
  sessionId,
  webSearchFn,
  cssSnippetFn,
  memoryContext,
}) {
  const workingMessage = enrichWithMemory({ message, memoryContext });
  const isFollowUp = /(same|darker|lighter|that|previous|follow-up|use it|use the same)/i.test(message);
  const memoryHasCssContext = /"mode":"tailwind"|"mode":"css"|bg-[a-z]+-\d+|border-[a-z]+-\d+/i.test(
    memoryContext || ""
  );
  if (looksLikeMath(message)) {
    const expression = workingMessage.replace(/[^0-9+\-*/(). ]/g, "").trim() || workingMessage;
    const result = await executeCalculatorTool({ input: expression, sessionId });
    return {
      sessionId,
      route: "calculator",
      toolsUsed: ["calculator"],
      response: result.output,
    };
  }

  if (looksLikeRagQuery(message)) {
    const ragResult = await executeRagSearchTool({ input: workingMessage, sessionId });
    return {
      sessionId,
      route: "rag_search",
      toolsUsed: ["rag_search"],
      response: ragResult.output,
    };
  }

  if (looksLikeCssRequest(message) || (isFollowUp && memoryHasCssContext)) {
    const mode = /tailwind/i.test(workingMessage) ? "tailwind" : "css";
    const cssResult = await executeCssSnippetTool({
      input: { description: workingMessage, mode },
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
    input: workingMessage,
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
  const safeSessionId = sessionId || `session-${Date.now()}`;
  const startedAt = Date.now();
  logger.info("agent_request_start", { sessionId: safeSessionId, userMessage: message });

  try {
    appendSessionTurn(safeSessionId, { role: "user", content: message });
    const memoryContext = getMemoryContext(safeSessionId);

    let result;
    if (!process.env.OPENAI_API_KEY) {
      result = await runDeterministicFallback({
        message,
        sessionId: safeSessionId,
        webSearchFn,
        cssSnippetFn,
        memoryContext,
      });
    } else {
      const executor = await getAgentExecutor({ sessionId: safeSessionId, webSearchFn });
      const response = await executor.invoke({
        input: enrichWithMemory({ message, memoryContext }),
      });
      result = {
        sessionId: safeSessionId,
        route: "react_agent",
        toolsUsed: ["calculator", "web_search", "rag_search", "css_snippet"],
        response: typeof response.output === "string" ? response.output : JSON.stringify(response.output),
      };
    }
    appendSessionTurn(safeSessionId, { role: "assistant", content: result.response });

    logger.info("agent_request_end", {
      sessionId: safeSessionId,
      route: result.route,
      toolsUsed: result.toolsUsed,
      durationMs: Date.now() - startedAt,
    });
    return result;
  } catch (error) {
    logger.error("agent_request_error", {
      sessionId: safeSessionId,
      userMessage: message,
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - startedAt,
    });
    throw error;
  }
}
