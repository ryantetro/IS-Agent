import {
  parseSources,
  stripSources,
  tryParseColorPalette,
  tryParseCssSnippet,
} from "./responseParser.js";

function normalizeSource(source) {
  if (typeof source === "string") {
    return {
      title: source,
      path: "",
      url: "",
      snippet: "",
    };
  }
  return {
    title: source?.title || "Source",
    path: source?.path || "",
    url: source?.url || "",
    snippet: source?.snippet || "",
  };
}

function mapArtifact(artifact, response) {
  if (artifact?.type === "css_snippet") {
    return {
      mode: artifact.mode,
      code: artifact.code,
      explanation: artifact.explanation || "",
      request: artifact.request || "",
    };
  }
  if (artifact?.type === "color_palette") {
    return artifact;
  }

  const cssSnippet = tryParseCssSnippet(response);
  if (cssSnippet) {
    return cssSnippet;
  }

  return tryParseColorPalette(response);
}

export function mapAgentPayload(payload) {
  const response = payload?.response || "";
  const artifact = mapArtifact(payload?.artifact, response);
  const cssSnippet = artifact && artifact.mode ? artifact : null;
  const palette = artifact && artifact.type === "color_palette" ? artifact : null;
  const sources =
    Array.isArray(payload?.sources) && payload.sources.length
      ? payload.sources.map(normalizeSource)
      : parseSources(response).map(normalizeSource);

  const text =
    typeof payload?.text === "string"
      ? payload.text
      : cssSnippet || palette
        ? ""
        : stripSources(response);

  return {
    text,
    toolsUsed: Array.isArray(payload?.toolsUsed) ? payload.toolsUsed : [],
    sources,
    codeSnippet: cssSnippet,
    palette,
    toolEvents: Array.isArray(payload?.toolEvents) ? payload.toolEvents : [],
  };
}

export function applyToolEventToDraft(message, event) {
  if (!event?.tool) return message;
  const toolsUsed = new Set(message.toolsUsed || []);
  toolsUsed.add(event.tool);
  const toolEvents = [...(message.toolEvents || []), event];
  const text =
    event.type === "tool_start" && (!message.text || message.text === "Thinking...")
      ? `Using ${event.tool.replace(/_/g, " ")}...`
      : message.text;
  return {
    ...message,
    text,
    toolsUsed: [...toolsUsed],
    toolEvents,
  };
}
