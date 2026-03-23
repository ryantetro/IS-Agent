import { useMemo, useState } from "react";
import { parseSources, stripSources, tryParseCssSnippet } from "../lib/responseParser.js";
import { streamMessage } from "./useStream.js";

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

function createAssistantPlaceholder() {
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    text: "",
    toolsUsed: [],
    sources: [],
    codeSnippet: null,
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
      const placeholder = createAssistantPlaceholder();
      setMessages((prev) => [...prev, placeholder]);

      let streamedText = "";
      await streamMessage({
        message: text,
        sessionId,
        onChunk: (chunk) => {
          streamedText += chunk;
          setMessages((prev) =>
            prev.map((msg) => (msg.id === placeholder.id ? { ...msg, text: streamedText } : msg))
          );
        },
        onComplete: (result) => {
          const mapped = mapAgentResponse(result);
          setMessages((prev) => prev.map((msg) => (msg.id === placeholder.id ? mapped : msg)));
        },
      });
    } catch (err) {
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
        setMessages((prev) => {
          const withoutDraft = [...prev];
          if (withoutDraft[withoutDraft.length - 1]?.role === "assistant") {
            withoutDraft.pop();
          }
          return [...withoutDraft, mapAgentResponse(payload)];
        });
      } catch (fallbackError) {
        setError(fallbackError instanceof Error ? fallbackError.message : "Unexpected request error");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return useMemo(
    () => ({ sessionId, messages, isLoading, error, sendMessage }),
    [sessionId, messages, isLoading, error]
  );
}
