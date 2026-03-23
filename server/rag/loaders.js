import fs from "node:fs/promises";
import path from "node:path";

function titleFromFilename(filename) {
  return filename
    .replace(/\.md$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function loadMarkdownDocs(docsDirectory) {
  const files = await fs.readdir(docsDirectory);
  const markdownFiles = files.filter((file) => file.toLowerCase().endsWith(".md"));

  const docs = [];
  for (const file of markdownFiles) {
    const absolutePath = path.join(docsDirectory, file);
    const content = await fs.readFile(absolutePath, "utf8");
    docs.push({
      sourceTitle: titleFromFilename(file),
      sourcePath: `server/rag/docs/${file}`,
      content,
    });
  }
  return docs;
}
