const fs = require("node:fs");
const path = require("node:path");
const { printJson, printError, run } = require("./_run");

const root = path.join(__dirname, "..");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function assert(cond, message) {
  if (!cond) {
    throw new Error(message);
  }
}

function assertDist() {
  const indexHtml = path.join(root, "client", "dist", "index.html");
  assert(fs.existsSync(indexHtml), "Expected client/dist/index.html after build");
}

function validateVercelConfigs() {
  const repoRootConfig = readJson(path.join(root, "vercel.json"));
  assert(repoRootConfig.outputDirectory === "client/dist", "vercel.json outputDirectory must be client/dist");
  assert(
    typeof repoRootConfig.installCommand === "string" && repoRootConfig.installCommand.includes("npm"),
    "vercel.json must set installCommand"
  );
  assert(
    typeof repoRootConfig.buildCommand === "string" && repoRootConfig.buildCommand.includes("designmind-client"),
    "vercel.json buildCommand must build workspace designmind-client"
  );

  const clientRootConfig = readJson(path.join(root, "client", "vercel.json"));
  assert(clientRootConfig.outputDirectory === "dist", "client/vercel.json outputDirectory must be dist");
  assert(
    typeof clientRootConfig.installCommand === "string" && clientRootConfig.installCommand.includes("cd .."),
    "client/vercel.json installCommand must run npm install from repo root (cd .. && npm install)"
  );
}

async function resetNodeModules() {
  for (const rel of ["node_modules", "client/node_modules", "server/node_modules"]) {
    const p = path.join(root, rel);
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true, force: true });
    }
  }
}

async function cleanRoomScenario(name, fn) {
  printJson({ script: "verify-vercel-build", cleanRoom: name, status: "starting" });
  await resetNodeModules();
  await fn();
  assertDist();
  printJson({ script: "verify-vercel-build", cleanRoom: name, status: "passed" });
}

async function main() {
  const cleanRoom = process.argv.includes("--clean-room");

  printJson({ script: "verify-vercel-build", status: "starting", cleanRoom });
  validateVercelConfigs();

  if (cleanRoom) {
    await cleanRoomScenario("repo_root_vercel_json", async () => {
      await run("npm", ["install", "--no-audit", "--no-fund"], { cwd: root });
      await run("npm", ["run", "build", "-w", "designmind-client"], { cwd: root });
    });

    await cleanRoomScenario("client_folder_vercel_json", async () => {
      const clientDir = path.join(root, "client");
      await run("npm", ["install", "--no-audit", "--no-fund"], { cwd: root });
      await run("npm", ["run", "build"], { cwd: clientDir });
    });
  } else {
    await run("npm", ["run", "build", "-w", "designmind-client"], { cwd: root });
    assertDist();
  }

  printJson({ script: "verify-vercel-build", status: "completed", cleanRoom });
}

main().catch((error) => {
  printError({
    script: "verify-vercel-build",
    status: "error",
    message: error.message,
  });
  process.exit(1);
});
