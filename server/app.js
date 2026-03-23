import express from "express";
import chatRouter from "./routes/chat.js";
import streamRouter from "./routes/stream.js";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "designmind-server" });
});

app.use("/api/chat", chatRouter);
app.use("/api/stream", streamRouter);

export default app;
