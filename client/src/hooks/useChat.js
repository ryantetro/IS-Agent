import { useCallback, useMemo, useRef, useState } from "react";
import { applyToolEventToDraft, mapAgentPayload } from "../lib/chatPayload.js";
import { streamMessage } from "./useStream.js";

function createSessionId() {
  return `ui-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function mapAgentResponse(payload) {
  const mapped = mapAgentPayload(payload);
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    text: mapped.text,
    toolsUsed: mapped.toolsUsed,
    sources: mapped.sources,
    codeSnippet: mapped.codeSnippet,
    palette: mapped.palette,
    toolEvents: mapped.toolEvents,
  };
}

function createAssistantPlaceholder(text = "Thinking...") {
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    text,
    toolsUsed: [],
    sources: [],
    codeSnippet: null,
    palette: null,
    toolEvents: [],
  };
}

function createAssistantErrorMessage(text) {
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    text,
    toolsUsed: [],
    sources: [],
    codeSnippet: null,
    palette: null,
    toolEvents: [],
  };
}

async function readResponsePayload(response) {
  const body = await response.text();

  if (!body) {
    return {};
  }

  try {
    return JSON.parse(body);
  } catch {
    return { message: body.replace(/\s+/g, " ").trim() };
  }
}

export function useChat() {
  const [sessionId, setSessionId] = useState(() => createSessionId());
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");
  const [toolsEnabled, setToolsEnabled] = useState(true);
  const sendingRef = useRef(false);

  const startNewChat = useCallback(() => {
    sendingRef.current = false;
    setSessionId(createSessionId());
    setMessages([]);
    setError("");
    setIsLoading(false);
  }, []);

  const sendMessage = useCallback(
    async (inputText) => {
      const text = inputText.trim();
      if (!text || sendingRef.current) return;
      sendingRef.current = true;

      const userMessage = {
        id: crypto.randomUUID(),
        role: "user",
        text,
        toolsUsed: [],
        sources: [],
        codeSnippet: null,
        palette: null,
        toolEvents: [],
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError("");
      const placeholder = createAssistantPlaceholder();
      setMessages((prev) => [...prev, placeholder]);

      try {
        let streamedText = "";
        await streamMessage({
          message: text,
          sessionId,
          model,
          toolsEnabled,
          onChunk: (chunk) => {
            streamedText += chunk;
            setMessages((prev) =>
              prev.map((msg) => (msg.id === placeholder.id ? { ...msg, text: streamedText } : msg))
            );
          },
          onToolEvent: (event) => {
            setMessages((prev) =>
              prev.map((msg) => (msg.id === placeholder.id ? applyToolEventToDraft(msg, event) : msg))
            );
          },
          onComplete: (result) => {
            const mapped = mapAgentResponse(result);
            setMessages((prev) => prev.map((msg) => (msg.id === placeholder.id ? mapped : msg)));
          },
        });
      } catch (err) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === placeholder.id ? { ...msg, text: "Streaming unavailable. Retrying..." } : msg
          )
        );

        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text, sessionId, model, toolsEnabled }),
          });
          const payload = await readResponsePayload(response);
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
          const failureMessage =
            fallbackError instanceof Error ? fallbackError.message : "Unexpected request error";
          setError(failureMessage);
          setMessages((prev) =>
            prev.map((msg) => (msg.id === placeholder.id ? createAssistantErrorMessage(failureMessage) : msg))
          );
        }
      } finally {
        sendingRef.current = false;
        setIsLoading(false);
      }
    },
    [sessionId, model, toolsEnabled]
  );

  return useMemo(
    () => ({
      sessionId,
      messages,
      isLoading,
      error,
      sendMessage,
      startNewChat,
      model,
      setModel,
      toolsEnabled,
      setToolsEnabled,
    }),
    [sessionId, messages, isLoading, error, sendMessage, startNewChat, model, toolsEnabled]
  );
}
