const { printJson, printError, run } = require("./_run");

async function main() {
  printJson({ script: "test", status: "starting" });
  await run("npm", ["--prefix", "server", "run", "test"]);
  await run("node", ["scripts/verify-phase2.js"]);
  await run("node", ["scripts/verify-phase3.js"]);
  await run("node", ["scripts/verify-phase4.js"]);
  await run("node", ["scripts/verify-phase5.js"]);
  await run("npm", ["--prefix", "client", "run", "test"]);
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
