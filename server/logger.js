export function log(level, message, meta = {}) {
  process.stdout.write(
    `${JSON.stringify({ level, message, ...meta, timestamp: new Date().toISOString() })}\n`
  );
}

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
