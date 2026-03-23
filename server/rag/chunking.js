export function chunkDocument({
  text,
  sourceTitle,
  sourcePath,
  chunkSize = 1200,
  overlap = 200,
}) {
  const normalized = (text || "").replace(/\r\n/g, "\n").trim();
  if (!normalized) {
    return [];
  }

  const chunks = [];
  let start = 0;
  while (start < normalized.length) {
    const end = Math.min(start + chunkSize, normalized.length);
    const content = normalized.slice(start, end).trim();
    if (content) {
      chunks.push({
        content,
        metadata: {
          sourceTitle,
          sourcePath,
          chunkIndex: chunks.length,
          totalChunks: 0,
        },
      });
    }
    if (end >= normalized.length) break;
    start = Math.max(end - overlap, start + 1);
  }

  const total = chunks.length;
  return chunks.map((chunk) => ({
    ...chunk,
    metadata: { ...chunk.metadata, totalChunks: total },
  }));
}
