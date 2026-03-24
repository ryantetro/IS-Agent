import "./loadEnv.js";
import app from "./app.js";

const port = Number(process.env.PORT || 3001);
const serverBuildTag = "server-index-debug-21b899-v2";

app.listen(port, () => {
  process.stdout.write(`${JSON.stringify({ event: "server_started", port, serverBuildTag })}\n`);
});
