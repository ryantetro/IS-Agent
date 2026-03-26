import { ChatOpenAI } from "@langchain/openai";
import { DynamicTool } from "@langchain/core/tools";
import { HumanMessage } from "@langchain/core/messages";
import { ChatConversationalAgent, AgentExecutor } from "langchain/agents";
import { logger } from "../logger.js";
import { executeCalculatorTool } from "./tools/calculator.js";
import { executeWebSearchTool } from "./tools/webSearch.js";
import { executeRagSearchTool, formatRagResponse } from "./tools/ragSearch.js";
import { executeCssSnippetTool, formatCssSnippetOutput, inferCssMode } from "./tools/cssSnippet.js";
import { appendSessionTurn, getSessionMessages } from "./memory.js";

const AGENT_RUNTIME_TAG = "react-agent-v1";

const DESIGN_MIND_SYSTEM = `You are DesignMind, a design and UX assistant with access to tools.

Use tools when they help. Prefer:
- calculator for arithmetic
- web_search for current/live design information
- rag_search for local design docs and guidelines
- css_snippet for CSS, Tailwind, or full HTML + Tailwind component generation

When a tool already produced the needed evidence, rely on it. Keep final answers concise, never expose chain-of-thought, and mention sources when your answer depends on retrieved guidance or web results.`;

const DESIGN_MIND_HUMAN = `TOOLS
------
Assistant can ask the user to use tools to look up information that may be helpful in answering the user's original question. The tools the human can use are:

{tools}

{format_instructions}

USER'S INPUT
--------------------
Respond to the user's latest input. Keep the final answer brief and helpful.

{{input}}`;

function canUseLiveOpenAI() {
  return Boolean(process.env.OPENAI_API_KEY) && process.env.DESIGNMIND_OFFLINE_TESTS !== "1";
}

function uniqueList(values) {
  return [...new Set(values.filter(Boolean))];
}

function looksLikeMath(message) {
  return /(\d+\s*[\+\-\*\/]\s*\d+)|calculate|what is \d+/i.test(message);
}

function looksLikeRagQuery(message) {
  return /(wcag|material design|apple hig|nielsen|heuristic|refactoring ui|guideline)/i.test(message);
}

function looksLikeCssRequest(message) {
  return /(tailwind|css|html|class(es)?|styles?|hover|button|card|layout|component|pricing|navbar|modal|form|snippet|palette)/i.test(message);
}

function looksLikeGreeting(message) {
  return /^(hi|hey|hello|yo|sup|good (morning|afternoon|evening))\b[!. ]*$/i.test(message.trim());
}

function looksLikeSearchQuery(message) {
  return /(latest|current|recent|trend|trends|up[- ]to[- ]date|search the web|find online|202[5-9])/i.test(
    message
  );
}

function getMemoryContextText(sessionId, limit = 6) {
  return getSessionMessages(sessionId, limit)
    .map((message) => `${message._getType()}: ${message.content}`)
    .join("\n");
}

function normalizeSource(source) {
  return {
    title: source.title || source.sourceTitle || "Source",
    path: source.path || source.sourcePath || "",
    url: source.url || "",
    snippet: source.snippet || "",
  };
}

function dedupeSources(sources) {
  const byKey = new Map();
  for (const source of sources || []) {
    const normalized = normalizeSource(source);
    const key = `${normalized.title}::${normalized.path || normalized.url || ""}`;
    if (!byKey.has(key)) {
      byKey.set(key, normalized);
    }
  }
  return [...byKey.values()];
}

function formatSourceLine(source) {
  const location = source.path || source.url || "unavailable";
  return `- ${source.title} (${location})`;
}

function appendSourcesBlock(text, sources) {
  if (!sources.length) {
    return text.trim();
  }
  if (/\nSources:\n/i.test(text)) {
    return text.trim();
  }
  return `${text.trim()}\n\nSources:\n${sources.map(formatSourceLine).join("\n")}`.trim();
}

function stripSourcesBlock(text) {
  if (typeof text !== "string") return "";
  if (!/\nSources:\n/i.test(text)) {
    return text.trim();
  }
  return text.split(/\nSources:\n/i)[0].trim();
}

function stripJsonCodeFence(text) {
  if (typeof text !== "string") return "";
  return text.replace(/```json[\s\S]*?```/gi, "").trim();
}

function buildLegacyResponse({ text, sources, artifact }) {
  if (artifact?.type === "css_snippet") {
    return formatCssSnippetOutput(artifact);
  }
  return appendSourcesBlock(text, sources);
}

function buildAssistantMemoryContent(result) {
  const parts = [];
  if (result.text) {
    parts.push(result.text);
  }
  if (result.artifact?.type === "css_snippet") {
    parts.push(`Artifact: ${formatCssSnippetOutput(result.artifact)}`);
  }
  if (result.sources?.length) {
    parts.push(`Sources:\n${result.sources.map(formatSourceLine).join("\n")}`);
  }
  return parts.filter(Boolean).join("\n\n");
}

function buildCssToolSummary(result) {
  const artifact = result.artifact;
  if (!artifact) {
    return "CSS snippet generation failed.";
  }
  return [
    `Generated ${artifact.mode} snippet.`,
    `Code: ${artifact.code}`,
    `Explanation: ${artifact.explanation}`,
  ].join("\n");
}

function normalizeToolResultText(text, artifact) {
  if (!artifact) {
    return stripSourcesBlock(text);
  }
  const stripped = stripJsonCodeFence(stripSourcesBlock(text));
  return stripped || artifact.explanation || "";
}

function coerceContentToText(content) {
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }
        if (part && typeof part === "object" && typeof part.text === "string") {
          return part.text;
        }
        return "";
      })
      .join("");
  }
  if (content == null) {
    return "";
  }
  return JSON.stringify(content);
}

function summarizeToolCalls(toolEvents = [], sources = []) {
  const calls = toolEvents
    .filter((event) => event?.type === "tool_end")
    .map((event) => ({
      tool: event.tool,
      input: event.input,
      output: event.outputPreview || "",
      durationMs: event.durationMs ?? null,
    }));

  if (calls.length === 1 && sources.length) {
    calls[0].sources = sources;
  } else if (calls.length > 1 && sources.length) {
    calls[calls.length - 1].sources = sources;
  }

  return calls;
}

function persistAgentResult({ sessionId, message, result, startedAt }) {
  const totalDurationMs = Date.now() - startedAt;
  appendSessionTurn(sessionId, { role: "user", content: message });
  appendSessionTurn(sessionId, {
    role: "assistant",
    content: buildAssistantMemoryContent(result),
  });

  logger.info("agent_request_end", {
    sessionId,
    userMessage: message,
    route: result.route,
    toolsUsed: result.toolsUsed,
    toolCalls: summarizeToolCalls(result.toolEvents, result.sources),
    sources: result.sources,
    artifactType: result.artifact?.type || null,
    finalResponse: result.response || result.text || result.artifact?.explanation || "",
    totalDurationMs,
    durationMs: totalDurationMs,
  });
}

function createToolContext({
  sessionId,
  webSearchFn,
  cssSnippetFn,
  modelName,
  onToolEvent,
}) {
  const state = {
    toolEvents: [],
    toolsUsed: [],
    sources: [],
    artifact: null,
  };

  async function emit(event) {
    state.toolEvents.push(event);
    if (onToolEvent) {
      await onToolEvent(event);
    }
  }

  function remember(result, toolName) {
    state.toolsUsed.push(toolName);
    if (Array.isArray(result?.sources)) {
      state.sources = dedupeSources([...state.sources, ...result.sources]);
    }
    if (result?.artifact) {
      state.artifact = result.artifact;
    }
  }

  async function runWrappedTool({ toolName, input, execute, formatForAgent }) {
    const startedAt = Date.now();
    await emit({
      type: "tool_start",
      tool: toolName,
      input,
      timestamp: new Date(startedAt).toISOString(),
    });
    const result = await execute();
    remember(result, toolName);
    await emit({
      type: "tool_end",
      tool: toolName,
      input,
      outputPreview: String(result.output || "").slice(0, 280),
      durationMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    });
    return formatForAgent ? formatForAgent(result) : result.output;
  }

  const tools = [
    new DynamicTool({
      name: "calculator",
      description: "Evaluate arithmetic expressions and numeric layout math.",
      func: async (input) =>
        runWrappedTool({
          toolName: "calculator",
          input,
          execute: () => executeCalculatorTool({ input, sessionId }),
        }),
    }),
    new DynamicTool({
      name: "web_search",
      description: "Search the live web for current design trends, references, and examples.",
      func: async (input) =>
        runWrappedTool({
          toolName: "web_search",
          input,
          execute: () => executeWebSearchTool({ input, sessionId, webSearchFn }),
        }),
    }),
    new DynamicTool({
      name: "rag_search",
      description: "Search the local design document corpus and return grounded guidance with sources.",
      func: async (input) =>
        runWrappedTool({
          toolName: "rag_search",
          input,
          execute: () => executeRagSearchTool({ input, sessionId, modelName }),
        }),
    }),
    new DynamicTool({
      name: "css_snippet",
      description:
        "Generate CSS, Tailwind utilities, or full HTML + Tailwind component markup. When the user asks for a component, card, layout, pricing block, navbar, or other UI element, prefer complete copy-pasteable HTML instead of classes-only output unless they explicitly ask for classes only.",
      func: async (input) =>
        runWrappedTool({
          toolName: "css_snippet",
          input,
          execute: () => executeCssSnippetTool({ input, sessionId, llmGenerate: cssSnippetFn }),
          formatForAgent: buildCssToolSummary,
        }),
    }),
  ];

  return { state, tools };
}

function finalizeAgentResult({ sessionId, route, text, toolState }) {
  const sources = dedupeSources(toolState.sources);
  const artifact = toolState.artifact;
  const normalizedText = normalizeToolResultText(text, artifact);
  return {
    sessionId,
    route,
    text: normalizedText,
    toolsUsed: uniqueList(toolState.toolsUsed),
    sources,
    artifact,
    toolEvents: toolState.toolEvents,
    response: buildLegacyResponse({
      text: normalizedText,
      sources,
      artifact,
    }),
  };
}

/** Whitelist client model ids; "designmind" → env default. */
export function resolveAgentModel(requested) {
  const envDefault = process.env.OPENAI_MODEL || "gpt-4o-mini";
  if (requested == null || requested === "" || requested === "designmind") {
    return envDefault;
  }
  const id = String(requested);
  const allowed = new Set(["gpt-4o-mini", "gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"]);
  return allowed.has(id) ? id : envDefault;
}

async function runDirectLlm({ message, sessionId, modelName }) {
  const model = new ChatOpenAI({
    model: resolveAgentModel(modelName),
    temperature: 0.2,
  });
  const messages = [...getSessionMessages(sessionId), new HumanMessage(message)];
  const aiMsg = await model.invoke(messages);
  const text = coerceContentToText(aiMsg?.content);

  return {
    sessionId,
    route: "direct_llm",
    text: text.trim(),
    toolsUsed: [],
    sources: [],
    artifact: null,
    toolEvents: [],
    response: text.trim(),
  };
}

async function runDirectLlmStream({
  message,
  sessionId,
  modelName,
  onEvent,
  onChunk,
}) {
  const model = new ChatOpenAI({
    model: resolveAgentModel(modelName),
    temperature: 0.2,
  });
  const messages = [...getSessionMessages(sessionId), new HumanMessage(message)];
  const stream = await model.stream(messages);
  let text = "";
  let chunkIndex = 0;

  for await (const chunk of stream) {
    const delta = coerceContentToText(chunk?.content);
    if (!delta) {
      continue;
    }

    text += delta;
    if (onChunk) {
      await onChunk(delta, chunkIndex);
    }
    if (onEvent) {
      await onEvent({ type: "delta", text: delta });
    }
    chunkIndex += 1;
  }

  const normalizedText = text.trim();
  return {
    sessionId,
    route: "direct_llm",
    text: normalizedText,
    toolsUsed: [],
    sources: [],
    artifact: null,
    toolEvents: [],
    response: normalizedText,
  };
}

async function runDeterministicFallback({
  message,
  sessionId,
  webSearchFn,
  cssSnippetFn,
  onToolEvent,
}) {
  const memoryContext = getMemoryContextText(sessionId);
  const workingMessage =
    /(same|darker|lighter|that|previous|follow-up|use it|use the same)/i.test(message) && memoryContext
      ? `${message}\n\nContext from memory:\n${memoryContext}`
      : message;
  const toolEvents = [];

  async function emitToolLifecycle(tool, input, execute) {
    const startedAt = Date.now();
    const startEvent = {
      type: "tool_start",
      tool,
      input,
      timestamp: new Date(startedAt).toISOString(),
    };
    toolEvents.push(startEvent);
    if (onToolEvent) await onToolEvent(startEvent);
    const result = await execute();
    const endEvent = {
      type: "tool_end",
      tool,
      input,
      outputPreview: String(result.output || "").slice(0, 280),
      durationMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    };
    toolEvents.push(endEvent);
    if (onToolEvent) await onToolEvent(endEvent);
    return result;
  }

  if (looksLikeMath(message)) {
    const expression = message.replace(/[^0-9+\-*/(). ]/g, "").trim() || message;
    const result = await emitToolLifecycle("calculator", expression, () =>
      executeCalculatorTool({ input: expression, sessionId })
    );
    return {
      sessionId,
      route: "calculator",
      text: result.output,
      toolsUsed: ["calculator"],
      sources: [],
      artifact: null,
      toolEvents,
      response: result.output,
    };
  }

  if (looksLikeRagQuery(message)) {
    const result = await emitToolLifecycle("rag_search", workingMessage, () =>
      executeRagSearchTool({ input: workingMessage, sessionId })
    );
    const sources = dedupeSources(result.sources);
    const text = stripSourcesBlock(result.output);
    return {
      sessionId,
      route: "rag_search",
      text,
      toolsUsed: ["rag_search"],
      sources,
      artifact: null,
      toolEvents,
      response: appendSourcesBlock(text, sources),
    };
  }

  if (looksLikeCssRequest(message)) {
    const mode = inferCssMode(workingMessage);
    const result = await emitToolLifecycle("css_snippet", workingMessage, () =>
      executeCssSnippetTool({
        input: { description: workingMessage, mode, constraints: "" },
        sessionId,
        llmGenerate: cssSnippetFn,
      })
    );
    const artifact = result.artifact;
    return {
      sessionId,
      route: "css_snippet",
      text: artifact?.explanation || "Generated a CSS snippet.",
      toolsUsed: ["css_snippet"],
      sources: [],
      artifact,
      toolEvents,
      response: result.output,
    };
  }

  if (looksLikeGreeting(message)) {
    const text =
      "Hey! What can I help you with today? I can do design research, generate CSS or Tailwind, and answer doc-based UX questions.";
    return {
      sessionId,
      route: "small_talk",
      text,
      toolsUsed: [],
      sources: [],
      artifact: null,
      toolEvents: [],
      response: text,
    };
  }

  const webResult = await emitToolLifecycle("web_search", workingMessage, () =>
    executeWebSearchTool({
      input: workingMessage,
      sessionId,
      webSearchFn,
    })
  );
  const sources = dedupeSources(webResult.sources);
  return {
    sessionId,
    route: "web_search",
    text: webResult.output,
    toolsUsed: ["web_search"],
    sources,
    artifact: null,
    toolEvents,
    response: appendSourcesBlock(webResult.output, sources),
  };
}

async function runReactAgent({
  message,
  sessionId,
  modelName,
  webSearchFn,
  cssSnippetFn,
  onToolEvent,
}) {
  const llm = new ChatOpenAI({
    model: resolveAgentModel(modelName),
    temperature: 0,
  });

  const { state, tools } = createToolContext({
    sessionId,
    webSearchFn,
    cssSnippetFn,
    modelName,
    onToolEvent,
  });

  const agent = ChatConversationalAgent.fromLLMAndTools(llm, tools, {
    systemMessage: DESIGN_MIND_SYSTEM,
    humanMessage: DESIGN_MIND_HUMAN,
  });

  const executor = new AgentExecutor({
    agent,
    tools,
    verbose: false,
    returnIntermediateSteps: true,
    maxIterations: 6,
    handleParsingErrors: true,
  });

  const result = await executor.invoke({
    input: message,
    chat_history: getSessionMessages(sessionId),
  });

  return finalizeAgentResult({
    sessionId,
    route: "react_agent",
    text: result.output,
    toolState: state,
  });
}

export async function runAgent({
  message,
  sessionId = "default",
  webSearchFn,
  cssSnippetFn,
  model: requestedModel,
  toolsEnabled = true,
  onToolEvent,
}) {
  const safeSessionId = sessionId || `session-${Date.now()}`;
  const modelName = resolveAgentModel(requestedModel);
  const useTools = toolsEnabled !== false;
  const startedAt = Date.now();

  logger.info("agent_request_start", {
    sessionId: safeSessionId,
    userMessage: message,
    model: modelName,
    toolsEnabled: useTools,
    agentRuntimeTag: AGENT_RUNTIME_TAG,
  });

  try {
    let result;
    if (looksLikeGreeting(message)) {
      const text =
        "Hey! What can I help you with today? I can do design research, generate CSS or Tailwind, and answer doc-based UX questions.";
      result = {
        sessionId: safeSessionId,
        route: "small_talk",
        text,
        toolsUsed: [],
        sources: [],
        artifact: null,
        toolEvents: [],
        response: text,
      };
    } else if (
      useTools &&
      (looksLikeMath(message) ||
        looksLikeRagQuery(message) ||
        looksLikeCssRequest(message) ||
        looksLikeSearchQuery(message))
    ) {
      result = await runDeterministicFallback({
        message,
        sessionId: safeSessionId,
        webSearchFn,
        cssSnippetFn,
        onToolEvent,
      });
    } else if (!process.env.OPENAI_API_KEY) {
      result = await runDeterministicFallback({
        message,
        sessionId: safeSessionId,
        webSearchFn,
        cssSnippetFn,
        onToolEvent,
      });
    } else if (!canUseLiveOpenAI()) {
      result = await runDeterministicFallback({
        message,
        sessionId: safeSessionId,
        webSearchFn,
        cssSnippetFn,
        onToolEvent,
      });
    } else if (!useTools) {
      result = await runDirectLlm({
        message,
        sessionId: safeSessionId,
        modelName,
      });
    } else {
      result = await runReactAgent({
        message,
        sessionId: safeSessionId,
        modelName,
        webSearchFn,
        cssSnippetFn,
        onToolEvent,
      });
      if (result.sources.length && !/\nSources:\n/i.test(result.response)) {
        result.response = appendSourcesBlock(result.text, result.sources);
      }
      if (!result.text && result.artifact?.type === "css_snippet") {
        result.text = result.artifact.explanation;
      }
    }

    persistAgentResult({
      sessionId: safeSessionId,
      message,
      result,
      startedAt,
    });
    return result;
  } catch (error) {
    const totalDurationMs = Date.now() - startedAt;
    logger.error("agent_request_error", {
      sessionId: safeSessionId,
      userMessage: message,
      error: error instanceof Error ? error.message : String(error),
      totalDurationMs,
      durationMs: totalDurationMs,
    });
    throw error;
  }
}

export async function streamAgentResponse({
  message,
  sessionId = "default",
  webSearchFn,
  cssSnippetFn,
  model,
  toolsEnabled,
  onEvent,
  onChunk,
  chunkSize = 42,
  chunkDelayMs = 0,
}) {
  void chunkSize;
  void chunkDelayMs;

  const safeSessionId = sessionId || `session-${Date.now()}`;
  const modelName = resolveAgentModel(model);
  const useTools = toolsEnabled !== false;
  const canStreamDirectLlm = !useTools && canUseLiveOpenAI() && !looksLikeGreeting(message);

  if (canStreamDirectLlm) {
    const startedAt = Date.now();
    logger.info("agent_request_start", {
      sessionId: safeSessionId,
      userMessage: message,
      model: modelName,
      toolsEnabled: useTools,
      agentRuntimeTag: AGENT_RUNTIME_TAG,
    });

    try {
      const result = await runDirectLlmStream({
        message,
        sessionId: safeSessionId,
        modelName,
        onEvent,
        onChunk,
      });
      persistAgentResult({
        sessionId: safeSessionId,
        message,
        result,
        startedAt,
      });
      return result;
    } catch (error) {
      const totalDurationMs = Date.now() - startedAt;
      logger.error("agent_request_error", {
        sessionId: safeSessionId,
        userMessage: message,
        error: error instanceof Error ? error.message : String(error),
        totalDurationMs,
        durationMs: totalDurationMs,
      });
      throw error;
    }
  }

  const result = await runAgent({
    message,
    sessionId: safeSessionId,
    webSearchFn,
    cssSnippetFn,
    model,
    toolsEnabled,
    onToolEvent: async (event) => {
      if (onEvent) {
        await onEvent(event);
      }
    },
  });

  const responseText = result.text || result.artifact?.explanation || "";
  return { ...result, text: responseText };
}

export { formatRagResponse };
