import express from "express";
import { createChatRouter } from "./routes/chat.js";
import { createStreamRouter } from "./routes/stream.js";

const HEALTH_BUILD_TAG = "server-app-debug-21b899-v3";

export function createApp({ runAgentImpl, streamAgentResponseImpl } = {}) {
  const app = express();
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
