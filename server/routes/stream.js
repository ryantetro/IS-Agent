import { Router } from "express";
import { logger } from "../logger.js";
import { streamAgentResponse } from "../agent/index.js";

function readToolsEnabled(value) {
  if (value === undefined || value === null || value === "") return true;
  return String(value).toLowerCase() !== "false";
}

function writeEvent(res, name, payload) {
  res.write(`event: ${name}\ndata: ${JSON.stringify(payload)}\n\n`);
}

function getStreamPayload(req) {
  if (req.method === "GET") {
    return {
      message: String(req.query.message || ""),
      sessionId: String(req.query.sessionId || `stream-${Date.now()}`),
      model: req.query.model ? String(req.query.model) : undefined,
      toolsEnabled: readToolsEnabled(req.query.toolsEnabled),
    };
  }

  const { message = "", sessionId = `stream-${Date.now()}`, model, toolsEnabled } = req.body || {};
  return {
    message,
    sessionId,
    model,
    toolsEnabled: readToolsEnabled(toolsEnabled),
  };
}

export function createStreamRouter({ streamAgentResponseImpl = streamAgentResponse } = {}) {
  const router = Router();

  async function handleStream(req, res) {
    const { message, sessionId, model, toolsEnabled } = getStreamPayload(req);

    if (!String(message).trim()) {
      res.status(400).json({
        error: "invalid_request",
        message: "message is required",
      });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    logger.info("stream_start", { sessionId, userMessage: message, model, toolsEnabled });
    writeEvent(res, "start", { sessionId });

    try {
      const result = await streamAgentResponseImpl({
        message,
        sessionId,
        model,
        toolsEnabled,
        onEvent: async (event) => {
          if (event?.type === "tool_start") {
            writeEvent(res, "tool_start", event);
            return;
          }
          if (event?.type === "tool_end") {
            writeEvent(res, "tool_end", event);
            return;
          }
          if (event?.type === "delta") {
            writeEvent(res, "delta", event);
          }
        },
      });

      logger.info("stream_complete", {
        sessionId,
        route: result.route,
        toolsUsed: result.toolsUsed,
      });
      writeEvent(res, "complete", result);
    } catch (error) {
      logger.error("stream_error", {
        sessionId,
        error: error instanceof Error ? error.message : String(error),
      });
      writeEvent(res, "error", {
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      res.end();
    }
  }

  router.post("/", handleStream);
  router.get("/", handleStream);

  return router;
}

export default createStreamRouter();
