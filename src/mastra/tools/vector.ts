import { openai } from "@ai-sdk/openai";
import { LibSQLVector } from "@mastra/core/vector/libsql";
import { createVectorQueryTool, MDocument } from "@mastra/rag";
import { embedMany } from "ai";
import { getEmbeddingIndex, defaultEmbedder } from "../utils/fastembed";



const doc = MDocument.fromText("Your text content...");

const chunks = await doc.chunk();

const { embeddings } = await embedMany({
    values: chunks.map((chunk) => chunk.text),
    model: openai.embedding("text-embedding-3-small"),
});

const libsql = new LibSQLVector({
    connectionUrl: "file:x_vector.db",
})

const { indexName, dimensions } = await getEmbeddingIndex();
await libsql.createIndex({
    indexName,
    dimension: dimensions,
});

await libsql.upsert({
    indexName,
    vectors: embeddings,
    metadata: chunks?.map((chunk) => ({ text: chunk.text })),
});

export const vectorQueryTool = createVectorQueryTool({
    vectorStoreName: "libsql",
    indexName,
    model: defaultEmbedder('bge-small-en-v1.5'),
    description: "Search through stored knowledge using semantic similarity with FastEmbed about the past conversations",
    enableFilter: true,
});