import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadMarkdownDocs } from "./loaders.js";
import { chunkDocument } from "./chunking.js";
import { upsertDocuments } from "./vectorStore.js";

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const docsDirectory = path.join(__dirname, "docs");
  const docs = await loadMarkdownDocs(docsDirectory);

  const chunks = docs.flatMap((doc) =>
    chunkDocument({
      text: doc.content,
      sourceTitle: doc.sourceTitle,
      sourcePath: doc.sourcePath,
    })
  );

  const storage = await upsertDocuments(chunks);
  process.stdout.write(
    `${JSON.stringify({
      script: "server/rag/ingestDocs",
      status: "completed",
      docsLoaded: docs.length,
      chunksStored: chunks.length,
      storage,
    })}\n`
  );
}

main().catch((error) => {
  process.stderr.write(
    `${JSON.stringify({
      script: "server/rag/ingestDocs",
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    })}\n`
  );
  process.exit(1);
});
