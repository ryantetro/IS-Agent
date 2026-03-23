const { printJson, printError, run } = require("./_run");

async function main() {
  printJson({ script: "run", status: "starting", target: "server" });
  await run("npm", ["--prefix", "server", "run", "start"]);
  printJson({ script: "run", status: "completed" });
}

main().catch((error) => {
  printError({
    script: "run",
    status: "error",
    message: error.message,
  });
  process.exit(1);
});
