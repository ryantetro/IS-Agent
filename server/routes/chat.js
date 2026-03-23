import { Router } from "express";
import { runAgent } from "../agent/index.js";

const router = Router();

router.post("/", async (req, res) => {
  const { message = "", sessionId = "default" } = req.body || {};
  const result = await runAgent({ message, sessionId });
  res.json(result);
});

export default router;
