import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_PATH = path.join(__dirname, "..", "..", "chroma_db", "rag-store.json");

function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function toEmbeddingMap(text) {
  const map = {};
  for (const token of tokenize(text)) {
    map[token] = (map[token] || 0) + 1;
  }
  return map;
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (const key of Object.keys(a)) {
    const av = a[key];
    const bv = b[key] || 0;
    dot += av * bv;
    normA += av * av;
  }
  for (const key of Object.keys(b)) {
    const bv = b[key];
    normB += bv * bv;
  }
  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function readStore() {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return { provider: "chroma", collection: "designmind-rag", records: [] };
  }
}

async function writeStore(store) {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function upsertDocuments(chunks) {
  const store = await readStore();
  store.records = chunks.map((chunk, index) => ({
    id: `chunk-${index}`,
    content: chunk.content,
    metadata: chunk.metadata,
    embedding: toEmbeddingMap(chunk.content),
  }));
  await writeStore(store);
  return { stored: store.records.length, path: STORE_PATH };
}

export async function similaritySearch(query, topK = 3) {
  const store = await readStore();
  const queryEmbedding = toEmbeddingMap(query);
  const ranked = store.records
    .map((record) => ({
      ...record,
      score: cosineSimilarity(queryEmbedding, record.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
  return ranked;
}

export async function getVectorStore() {
  const store = await readStore();
  return {
    provider: "chroma",
    collection: store.collection,
    records: store.records.length,
    path: STORE_PATH,
  };
}
