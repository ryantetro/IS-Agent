import { useMemo, useState } from "react";
import { parseSources, stripSources, tryParseCssSnippet } from "../lib/responseParser.js";

function createSessionId() {
  return `ui-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function mapAgentResponse(payload) {
  const content = payload?.response || "";
  const cssSnippet = tryParseCssSnippet(content);
  const sources = cssSnippet ? [] : parseSources(content);

  return {
    id: crypto.randomUUID(),
    role: "assistant",
    text: cssSnippet ? "" : stripSources(content),
    toolsUsed: Array.isArray(payload?.toolsUsed) ? payload.toolsUsed : [],
    sources,
    codeSnippet: cssSnippet,
  };
}

export function useChat() {
  const [sessionId] = useState(() => createSessionId());
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(inputText) {
    const text = inputText.trim();
    if (!text || isLoading) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text,
      toolsUsed: [],
      sources: [],
      codeSnippet: null,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || "Request failed");
      }

      setMessages((prev) => [...prev, mapAgentResponse(payload)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected request error");
    } finally {
      setIsLoading(false);
    }
  }

  return useMemo(
    () => ({ sessionId, messages, isLoading, error, sendMessage }),
    [sessionId, messages, isLoading, error]
  );
}
