const { spawn } = require("node:child_process");

function printJson(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

function printError(payload) {
  process.stderr.write(`${JSON.stringify(payload)}\n`);
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      shell: true,
      stdio: "inherit",
      ...options,
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`Command failed: ${command} ${args.join(" ")}`));
    });
  });
}

module.exports = { printJson, printError, run };
