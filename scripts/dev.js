const http = require("node:http");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { printJson, printError, run } = require("./_run");

const root = path.join(__dirname, "..");
const API_HOST = process.env.API_HOST || "127.0.0.1";
const API_PORT = Number(process.env.PORT || process.env.API_PORT || 3001);

function waitForApiReady({ host, port, timeoutMs = 25_000, intervalMs = 200 } = {}) {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeoutMs;

    function tryOnce() {
      const req = http.request(
        { hostname: host, port, path: "/health", method: "GET", timeout: 2000 },
        (res) => {
          let body = "";
          res.on("data", (chunk) => {
            body += chunk;
          });
          res.on("end", () => {
            if (res.statusCode !== 200) {
              schedule();
              return;
            }
            try {
              const parsed = JSON.parse(body || "{}");
              // Guard against stale old servers: our current API exposes buildTag in /health.
              if (parsed?.ok === true && typeof parsed?.buildTag === "string" && parsed.buildTag.length > 0) {
                resolve();
                return;
              }
              schedule();
            } catch {
              schedule();
            }
          });
        }
      );
      req.on("error", schedule);
      req.on("timeout", () => {
        req.destroy();
        schedule();
      });
      req.end();
    }

    function schedule() {
      if (Date.now() > deadline) {
        reject(
          new Error(
            `API server did not respond on http://${host}:${port}/health within ${timeoutMs}ms. Check server logs.`
          )
        );
        return;
      }
      setTimeout(tryOnce, intervalMs);
    }

    tryOnce();
  });
}

function probeStreamRoute({ host, port, timeoutMs = 2_500 } = {}) {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: host,
        port,
        path: "/api/stream",
        method: "POST",
        timeout: timeoutMs,
        headers: { "Content-Type": "application/json" },
      },
      (res) => {
        res.resume();
        res.on("end", () => {
          resolve({
            ok: res.statusCode === 400,
            statusCode: res.statusCode ?? 0,
          });
        });
      }
    );

    req.on("error", () => resolve({ ok: false, statusCode: 0 }));
    req.on("timeout", () => {
      req.destroy();
      resolve({ ok: false, statusCode: 0 });
    });
    req.write("{}");
    req.end();
  });
}

async function inspectApi({ host, port }) {
  try {
    await waitForApiReady({ host, port, timeoutMs: 1_200, intervalMs: 150 });
  } catch {
    return { status: "missing" };
  }

  const streamRoute = await probeStreamRoute({ host, port });
  if (streamRoute.ok) {
    return { status: "compatible" };
  }

  return {
    status: "incompatible",
    detail: `POST /api/stream returned ${streamRoute.statusCode || "an unexpected response"}.`,
  };
}

async function main() {
  printJson({
    script: "dev",
    status: "starting",
    api: `http://${API_HOST}:${API_PORT}`,
    note: "Starting API server, then Vite (proxy /api → API)",
  });

  const apiState = await inspectApi({ host: API_HOST, port: API_PORT });
  let serverProc = null;
  let startedServer = false;

  if (apiState.status === "compatible") {
    printJson({
      script: "dev",
      status: "reusing_api",
      api: `http://${API_HOST}:${API_PORT}`,
      note: "Detected running API server; starting only Vite client",
    });
  } else if (apiState.status === "incompatible") {
    throw new Error(
      `An incompatible API is already running on http://${API_HOST}:${API_PORT}. ${apiState.detail} ` +
        "Stop the stale server on that port, then run `npm run dev` again."
    );
  } else {
    serverProc = spawn("npm", ["--prefix", "server", "run", "dev"], {
      cwd: root,
      shell: true,
      stdio: "inherit",
      env: { ...process.env, PORT: String(API_PORT) },
    });
    startedServer = true;
  }

  const killServer = () => {
    if (startedServer && serverProc && !serverProc.killed) {
      serverProc.kill("SIGTERM");
    }
  };

  process.on("SIGINT", killServer);
  process.on("SIGTERM", killServer);
  if (serverProc) {
    serverProc.on("error", killServer);
  }

  if (startedServer) {
    const waitForServerExit = new Promise((_, reject) => {
      serverProc.on("exit", (code, signal) => {
        // If the server exits before Vite starts, it's usually EADDRINUSE or startup failure.
        reject(
          new Error(
            `Server process exited early (code=${code ?? "null"}, signal=${signal ?? "null"}). ` +
              `A different process may already be using ${API_PORT}.`
          )
        );
      });
    });

    try {
      await Promise.race([waitForApiReady({ host: API_HOST, port: API_PORT }), waitForServerExit]);
    } catch (error) {
      killServer();
      throw error;
    }
  }

  try {
    await run("npm", ["--prefix", "client", "run", "dev"], {
      cwd: root,
      env: { ...process.env, VITE_API_PROXY: `http://${API_HOST}:${API_PORT}` },
    });
  } finally {
    killServer();
  }

  printJson({ script: "dev", status: "completed" });
}

main().catch((error) => {
  printError({
    script: "dev",
    status: "error",
    message: error.message,
  });
  process.exit(1);
});
