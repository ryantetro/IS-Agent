import { Router } from "express";
import { runAgent } from "../agent/index.js";

function readToolsEnabled(value) {
  if (value === false || value === "false") return false;
  return true;
}

export function createChatRouter({ runAgentImpl = runAgent } = {}) {
  const router = Router();

  router.post("/", async (req, res) => {
    const { message = "", sessionId = "default", model, toolsEnabled: toolsFlag } = req.body || {};
    try {
      const result = await runAgentImpl({
        message,
        sessionId,
        model,
        toolsEnabled: readToolsEnabled(toolsFlag),
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: "agent_execution_failed",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  return router;
}

export default createChatRouter();
