const { printJson, printError, run } = require("./_run");

async function main() {
  printJson({ script: "test", status: "starting" });
  await run("npm", ["--prefix", "server", "run", "test"]);
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
