import { apiPath } from "../lib/apiPath.js";

function parseEventBlock(block) {
  const lines = block.split("\n");
  const event = { name: "message", data: "" };
  for (const line of lines) {
    if (line.startsWith("event:")) {
      event.name = line.slice(6).trim();
    }
    if (line.startsWith("data:")) {
      event.data += line.slice(5).trim();
    }
  }
  return event;
}

async function readErrorMessage(response, fallback) {
  let body = "";

  try {
    body = await response.text();
  } catch {
    return fallback;
  }

  if (!body) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(body);
    if (typeof parsed?.message === "string" && parsed.message.trim()) {
      return parsed.message.trim();
    }
  } catch {
    // Ignore non-JSON bodies and fall back to plain text below.
  }

  return body.replace(/\s+/g, " ").trim() || fallback;
}

export async function streamMessage({
  message,
  sessionId,
  model,
  toolsEnabled,
  onStart,
  onChunk,
  onToolEvent,
  onComplete,
  onFail,
}) {
  const response = await fetch(apiPath("/api/stream"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      sessionId,
      model,
      toolsEnabled: toolsEnabled === false ? "false" : "true",
    }),
  });

  if (!response.ok || !response.body) {
    const fallbackMessage =
      response.status === 404
        ? "Streaming endpoint unavailable (404). Your API server may be stale. Restart `npm run dev`."
        : `Streaming request failed (${response.status}).`;
    const detail = await readErrorMessage(response, fallbackMessage);
    throw new Error(detail);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done });

    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() || "";

    for (const block of blocks) {
      if (!block.trim()) continue;
      const { name, data } = parseEventBlock(block);
      const payload = data ? JSON.parse(data) : {};

      if (name === "start" && onStart) onStart(payload);
      if (name === "tool_start" || name === "tool_end") {
        if (onToolEvent) onToolEvent(payload);
      }
      if (name === "delta" && onChunk) onChunk(payload.text || "");
      if (name === "complete") {
        if (onComplete) onComplete(payload);
        return payload;
      }
      if (name === "error") {
        if (onFail) onFail(payload);
        throw new Error(payload.message || "stream failed");
      }
    }

    if (done) {
      break;
    }
  }

  throw new Error("stream connection closed before completion");
}
