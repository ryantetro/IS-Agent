import express from "express";
import { createChatRouter } from "./routes/chat.js";
import { createStreamRouter } from "./routes/stream.js";

const HEALTH_BUILD_TAG = "server-app-debug-21b899-v3";

export function createApp({ runAgentImpl, streamAgentResponseImpl } = {}) {
  const app = express();
  const corsOrigin = process.env.CORS_ORIGIN;
  if (typeof corsOrigin === "string" && corsOrigin.trim()) {
    const origin = corsOrigin.trim();
    app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      if (req.method === "OPTIONS") {
        res.status(204).end();
        return;
      }
      next();
    });
  }
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "designmind-server", buildTag: HEALTH_BUILD_TAG });
  });

  app.use("/api/chat", createChatRouter({ runAgentImpl }));
  app.use("/api/stream", createStreamRouter({ streamAgentResponseImpl }));

  return app;
}

const app = createApp();
export default app;
