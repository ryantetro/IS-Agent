const { spawn } = require("node:child_process");

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { shell: true, stdio: "inherit" });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} failed`));
    });
  });
}

async function main() {
  await run("npm", ["--prefix", "client", "run", "test"]);
  await run("npm", ["--prefix", "client", "run", "build"]);
  process.stdout.write(
    `${JSON.stringify({
      script: "verify-phase6",
      status: "completed",
      checks: ["client unit tests", "client build"],
    })}\n`
  );
}

main().catch((error) => {
  process.stderr.write(
    `${JSON.stringify({
      script: "verify-phase6",
      status: "error",
      message: error.message,
    })}\n`
  );
  process.exit(1);
});
