import { Router } from "express";
import { runAgent } from "../agent/index.js";

const router = Router();

router.post("/", async (req, res) => {
  const { message = "", sessionId = "default" } = req.body || {};
  try {
    const result = await runAgent({ message, sessionId });
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "agent_execution_failed",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

export default router;
