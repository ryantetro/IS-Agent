const { printJson, printError, run } = require("./_run");

async function main() {
  printJson({ script: "dev", status: "starting", target: "client" });
  await run("npm", ["--prefix", "client", "run", "dev"]);
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
