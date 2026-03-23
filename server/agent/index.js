import { logger } from "../logger.js";

export async function runAgent({ message, sessionId }) {
  logger.info("agent_run_started", { sessionId });
  return {
    sessionId,
    response: `Scaffold response: received "${message}".`,
    toolsUsed: [],
  };
}
