const { printJson, printError, run } = require("./_run");

async function main() {
  printJson({ script: "build", status: "starting" });
  await run("npm", ["--prefix", "client", "run", "build"]);
  await run("npm", ["--prefix", "server", "run", "build"]);
  printJson({ script: "build", status: "completed" });
}

main().catch((error) => {
  printError({
    script: "build",
    status: "error",
    message: error.message,
  });
  process.exit(1);
});
