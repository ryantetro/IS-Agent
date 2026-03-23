import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.status(501).json({
    error: "not_implemented",
    message: "Streaming endpoint scaffolded for later roadmap phase.",
  });
});

export default router;
