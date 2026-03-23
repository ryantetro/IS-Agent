import { ChatOpenAI } from "@langchain/openai";
import { logger } from "../logger.js";
import { executeCalculatorTool, createCalculatorLangChainTool } from "./tools/calculator.js";
import { executeWebSearchTool, createWebSearchLangChainTool } from "./tools/webSearch.js";

let cachedExecutor = null;

function looksLikeMath(message) {
  return /(\d+\s*[\+\-\*\/]\s*\d+)|calculate|what is \d+/i.test(message);
}

async function runDeterministicFallback({ message, sessionId, webSearchFn }) {
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
  ];

  const prompt = `You are DesignMind phase-2 agent. Use calculator for arithmetic. Use web_search for current trends/examples. Keep final answers concise.`;
  const agent = await createReactAgent({ llm: model, tools, prompt });
  cachedExecutor = new AgentExecutor({ agent, tools, verbose: false });
  return cachedExecutor;
}

export async function runAgent({ message, sessionId = "default", webSearchFn }) {
  const startedAt = Date.now();
  logger.info("agent_request_start", { sessionId, userMessage: message });

  try {
    let result;
    if (!process.env.OPENAI_API_KEY) {
      result = await runDeterministicFallback({ message, sessionId, webSearchFn });
    } else {
      const executor = await getAgentExecutor({ sessionId, webSearchFn });
      const response = await executor.invoke({ input: message });
      result = {
        sessionId,
        route: "react_agent",
        toolsUsed: ["calculator", "web_search"],
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
