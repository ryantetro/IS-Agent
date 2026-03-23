import app from "./app.js";

const port = Number(process.env.PORT || 3001);

app.listen(port, () => {
  process.stdout.write(`${JSON.stringify({ event: "server_started", port })}\n`);
});
