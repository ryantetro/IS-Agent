import { Router } from "express";
import { logger } from "../logger.js";
import { streamAgentResponse } from "../agent/index.js";

const router = Router();

router.get("/", async (req, res) => {
  const message = String(req.query.message || "");
  const sessionId = String(req.query.sessionId || `stream-${Date.now()}`);

  if (!message.trim()) {
    res.status(400).json({
      error: "invalid_request",
      message: "message query param is required",
    });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  logger.info("stream_start", { sessionId, userMessage: message });
  res.write(`event: start\ndata: ${JSON.stringify({ sessionId })}\n\n`);

  let chunkCount = 0;
  try {
    const result = await streamAgentResponse({
      message,
      sessionId,
      onChunk: async (chunk) => {
        chunkCount += 1;
        logger.debug("stream_chunk_emitted", { sessionId, chunkCount, size: chunk.length });
        res.write(`event: chunk\ndata: ${JSON.stringify({ text: chunk })}\n\n`);
      },
    });

    logger.info("stream_complete", {
      sessionId,
      chunkCount,
      route: result.route,
      toolsUsed: result.toolsUsed,
    });
    res.write(`event: complete\ndata: ${JSON.stringify(result)}\n\n`);
  } catch (error) {
    logger.error("stream_error", {
      sessionId,
      error: error instanceof Error ? error.message : String(error),
    });
    res.write(
      `event: fail\ndata: ${JSON.stringify({
        message: error instanceof Error ? error.message : String(error),
      })}\n\n`
    );
  } finally {
    res.end();
  }
});

export default router;
