const { printJson, printError, run } = require("./_run");

async function main() {
  const offlineEnv = { ...process.env, DESIGNMIND_OFFLINE_TESTS: "1" };
  printJson({ script: "test", status: "starting" });
  await run("npm", ["--prefix", "server", "run", "test"], { env: offlineEnv });
  await run("node", ["scripts/verify-phase2.js"], { env: offlineEnv });
  await run("node", ["scripts/verify-phase3.js"], { env: offlineEnv });
  await run("node", ["scripts/verify-phase4.js"], { env: offlineEnv });
  await run("node", ["scripts/verify-phase5.js"], { env: offlineEnv });
  await run("node", ["scripts/verify-phase6.js"], { env: offlineEnv });
  await run("node", ["scripts/verify-phase7.js"], { env: offlineEnv });
  await run("node", ["scripts/verify-phase8.js"], { env: offlineEnv });
  await run("node", ["scripts/verify-phase9.js"], { env: offlineEnv });
  await run("node", ["scripts/verify-assignment.js"], { env: offlineEnv });
  await run("npm", ["--prefix", "client", "run", "test"], { env: offlineEnv });
  printJson({ script: "test", status: "completed" });
}

main().catch((error) => {
  printError({
    script: "test",
    status: "error",
    message: error.message,
  });
  process.exit(1);
});
