/**
 * Load env from repo root (where .env.local usually lives) and optional server-local files.
 * Node does not read .env* automatically; Vite does for the client only.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const files = [
  path.join(repoRoot, ".env"),
  path.join(repoRoot, ".env.local"),
  path.join(__dirname, ".env"),
  path.join(__dirname, ".env.local"),
];

const originalEnvKeys = new Set(Object.keys(process.env));

for (const filePath of files) {
  if (!fs.existsSync(filePath)) {
    continue;
  }

  const parsed = dotenv.parse(fs.readFileSync(filePath));

  for (const [key, value] of Object.entries(parsed)) {
    if (originalEnvKeys.has(key)) {
      continue;
    }

    process.env[key] = value;
  }
}
