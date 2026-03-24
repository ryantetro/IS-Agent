import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { OpenAIEmbeddings } from "@langchain/openai";
import { loadMarkdownDocs } from "./loaders.js";
import { chunkDocument } from "./chunking.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_PATH = path.join(__dirname, "..", "..", "chroma_db", "rag-store.json");
const DOCS_PATH = path.join(__dirname, "docs");
const OPENAI_EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";
const FALLBACK_DIMENSIONS = 256;

function dotProduct(a, b) {
  let dot = 0;
  for (let index = 0; index < a.length; index += 1) {
    dot += (a[index] || 0) * (b[index] || 0);
  }
  return dot;
}

function magnitude(vector) {
  return Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
}

function cosineSimilarity(a, b) {
  const divisor = magnitude(a) * magnitude(b);
  if (!divisor) return 0;
  return dotProduct(a, b) / divisor;
}

function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function normalizeVector(values) {
  const norm = magnitude(values);
  if (!norm) return values;
  return values.map((value) => value / norm);
}

function fallbackEmbedText(text, dimensions = FALLBACK_DIMENSIONS) {
  const vector = new Array(dimensions).fill(0);
  for (const token of tokenize(text)) {
    let hash = 2166136261;
    for (let index = 0; index < token.length; index += 1) {
      hash ^= token.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    const bucket = Math.abs(hash) % dimensions;
    const sign = hash & 1 ? 1 : -1;
    vector[bucket] += sign * (1 + token.length / 24);
  }
  return normalizeVector(vector);
}

function usesOpenAIEmbeddings() {
  return Boolean(process.env.OPENAI_API_KEY) && process.env.DESIGNMIND_OFFLINE_TESTS !== "1";
}

function embeddingProviderLabel() {
  return usesOpenAIEmbeddings() ? "openai" : "fallback";
}

async function createEmbeddingClient() {
  if (!usesOpenAIEmbeddings()) {
    return null;
  }
  return new OpenAIEmbeddings({
    model: OPENAI_EMBEDDING_MODEL,
  });
}

async function embedDocuments(texts) {
  const embeddingClient = await createEmbeddingClient();
  if (!embeddingClient) {
    return texts.map((text) => fallbackEmbedText(text));
  }
  const vectors = await embeddingClient.embedDocuments(texts);
  return vectors.map((vector) => normalizeVector(vector));
}

async function embedQuery(text) {
  const embeddingClient = await createEmbeddingClient();
  if (!embeddingClient) {
    return fallbackEmbedText(text);
  }
  const vector = await embeddingClient.embedQuery(text);
  return normalizeVector(vector);
}

async function readStore() {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.records)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

async function writeStore(store) {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

function isLegacyStore(store) {
  if (!store) return true;
  if (!Array.isArray(store.records)) return true;
  return store.records.some(
    (record) => !Array.isArray(record.embedding) || typeof record.content !== "string"
  );
}

async function loadChunksFromDocs() {
  const docs = await loadMarkdownDocs(DOCS_PATH);
  return docs.flatMap((doc) =>
    chunkDocument({
      text: doc.content,
      sourceTitle: doc.sourceTitle,
      sourcePath: doc.sourcePath,
    })
  );
}

function buildStoreMetadata(records) {
  return {
    provider: "json-embeddings",
    embeddingProvider: embeddingProviderLabel(),
    embeddingModel: usesOpenAIEmbeddings() ? OPENAI_EMBEDDING_MODEL : "local-hash",
    collection: "designmind-rag",
    createdAt: new Date().toISOString(),
    dimensions: records[0]?.embedding?.length || FALLBACK_DIMENSIONS,
  };
}

export async function upsertDocuments(chunks) {
  const embeddings = await embedDocuments(chunks.map((chunk) => chunk.content));
  const records = chunks.map((chunk, index) => ({
    id: `chunk-${index}`,
    content: chunk.content,
    metadata: chunk.metadata,
    embedding: embeddings[index],
  }));
  const store = {
    ...buildStoreMetadata(records),
    records,
  };
  await writeStore(store);
  return { stored: store.records.length, path: STORE_PATH, embeddingProvider: store.embeddingProvider };
}

async function rebuildStore() {
  const chunks = await loadChunksFromDocs();
  return upsertDocuments(chunks);
}

async function ensureStore() {
  const existing = await readStore();
  const expectedProvider = embeddingProviderLabel();
  if (
    !existing ||
    isLegacyStore(existing) ||
    existing.embeddingProvider !== expectedProvider ||
    !existing.records.length
  ) {
    await rebuildStore();
  }
  return readStore();
}

export async function similaritySearch(query, topK = 3) {
  const store = await ensureStore();
  const queryEmbedding = await embedQuery(query);
  return store.records
    .map((record) => ({
      ...record,
      score: cosineSimilarity(queryEmbedding, record.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

export async function getVectorStore() {
  const store = await ensureStore();
  return {
    provider: store.provider,
    embeddingProvider: store.embeddingProvider,
    embeddingModel: store.embeddingModel,
    collection: store.collection,
    records: store.records.length,
    path: STORE_PATH,
    dimensions: store.dimensions,
  };
}
