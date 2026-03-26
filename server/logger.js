import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const defaultLogFilePath = path.join(repoRoot, "logs", `designmind-${new Date().toISOString().slice(0, 10)}.ndjson`);

export const logFilePath = process.env.DESIGNMIND_LOG_FILE || defaultLogFilePath;

let logStream;

function getLogStream() {
  if (!logStream) {
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
    fs.closeSync(fs.openSync(logFilePath, "a"));
    logStream = fs.createWriteStream(logFilePath, { flags: "a" });
    logStream.on("error", (error) => {
      process.stderr.write(
        `${JSON.stringify({
          level: "error",
          message: "logger_file_error",
          error: error instanceof Error ? error.message : String(error),
          logFilePath,
          timestamp: new Date().toISOString(),
        })}\n`
      );
    });
  }

  return logStream;
}

export function log(level, message, meta = {}) {
  const line = `${JSON.stringify({ level, message, ...meta, timestamp: new Date().toISOString() })}\n`;
  process.stdout.write(line);
  getLogStream().write(line);
}

process.on("exit", () => {
  if (logStream) {
    logStream.end();
  }
});

export const logger = {
  error(message, meta) {
    log("error", message, meta);
  },
  warn(message, meta) {
    log("warn", message, meta);
  },
  info(message, meta) {
    log("info", message, meta);
  },
  debug(message, meta) {
    log("debug", message, meta);
  },
};
