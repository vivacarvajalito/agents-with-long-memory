import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { experimental_customProvider } from 'ai';

async function getModelCachePath() {
    const cachePath = path.join(os.homedir(), '.cache', 'mastra', 'fastembed-models');
    await fsp.mkdir(cachePath, { recursive: true });
    return cachePath;
}

function unbundleableImport(name: string) {
    const nonStaticallyAnalyzableName = `${name}?d=${Date.now()}`; // +? date to prevent esbuild from seeing this as statically analyzable and bundling this as a regular import.
    return import(nonStaticallyAnalyzableName.split(`?`)[0]!); // remove the date to prevent module not found errors in cloud
}

let useFastEmbedWebFallback = false;

// Shared function to generate embeddings using fastembed
async function generateEmbeddings(values: string[], modelType: 'BGESmallENV15' | 'BGEBaseENV15') {
    try {
        // Dynamically import fastembed only when this function is called
        // this is to avoid importing fastembed in runtimes that don't support its native bindings
        let mod: any;
        const importErrors: Error[] = [];

        if (useFastEmbedWebFallback) {
            // TODO: see below
            // mod = await unbundleableImport('fastembed-web');
        } else {
            try {
                mod = await unbundleableImport('fastembed');
            } catch (e) {
                if (e instanceof Error) {
                    importErrors.push(e);
                } else {
                    throw e;
                }
                // TODO: once vercel deploys are fixed, install fastembed-web and try it as a fallback
                // try {
                //   mod = await unbundleableImport('fastembed-web');
                //   useFastEmbedWebFallback = true;
                // } catch (e) {
                //   if (e instanceof Error) {
                //     importErrors.push(e);
                //   } else {
                //     throw e;
                //   }
                // }
            }
        }

        if (!mod) {
            throw new Error(`${importErrors.map(e => e.message).join(`\n`)}

This runtime does not support fastembed-js, which is the default embedder in Mastra. 
Scroll up to read import errors. These errors mean you can't use the default Mastra embedder on this hosting platform.
You can either use Mastra Cloud which supports the default embedder, or you can configure an alternate provider.

For example if you're using Memory:

import { openai } from "@ai-sdk/openai";

const memory = new Memory({
  embedder: openai.embedding("text-embedding-3-small"), // <- doesn't have to be openai
})

Visit https://sdk.vercel.ai/docs/foundations/overview#embedding-models to find an alternate embedding provider

If you do not want to use the Memory semantic recall feature, you can disable it entirely and this error will go away.

const memory = new Memory({
  options: {
    semanticRecall: false // <- an embedder will not be required with this set to false
  }
})
`);
        }

        const { FlagEmbedding, EmbeddingModel } = mod;

        const model = await FlagEmbedding.init({
            model: EmbeddingModel[modelType],
            cacheDir: await getModelCachePath(),
        });

        // model.embed() returns an AsyncGenerator that processes texts in batches (default size 256)
        const embeddings = await model.embed(values);

        const allResults = [];
        for await (const result of embeddings) {
            // result is an array of embeddings, one for each text in the batch
            // We convert each Float32Array embedding to a regular number array
            // @ts-ignore unbundleableImport fn breaks types
            allResults.push(...result.map(embedding => Array.from(embedding)));
        }

        if (allResults.length === 0) throw new Error('No embeddings generated');

        return {
            embeddings: allResults,
        };
    } catch (error) {
        console.error('Error generating embeddings:', error);
        throw error;
    }
}

const fastEmbedProvider = experimental_customProvider({
    textEmbeddingModels: {
        'bge-small-en-v1.5': {
            specificationVersion: 'v1',
            provider: 'fastembed',
            modelId: 'bge-small-en-v1.5',
            maxEmbeddingsPerCall: 256,
            supportsParallelCalls: true,
            async doEmbed({ values }) {
                return generateEmbeddings(values, 'BGESmallENV15');
            },
        },
        'bge-base-en-v1.5': {
            specificationVersion: 'v1',
            provider: 'fastembed',
            modelId: 'bge-base-en-v1.5',
            maxEmbeddingsPerCall: 256,
            supportsParallelCalls: true,
            async doEmbed({ values }) {
                return generateEmbeddings(values, 'BGEBaseENV15');
            },
        },
    },
});

export const getEmbeddingIndex = async (modelId = 'bge-small-en-v1.5'): Promise<{ indexName: string, dimensions: number }> => {
    const defaultDimensions = 1536;

    // AI SDK doesn't expose a way to check how many dimensions a model uses.
    const dimensionsByModelId: Record<string, number> = {
        'bge-small-en-v1.5': 384,
        'bge-base-en-v1.5': 768,
    };

    const dimensions = dimensionsByModelId[modelId] || defaultDimensions;
    const isDefault = dimensions === defaultDimensions;
    const indexName = isDefault ? 'memory_messages' : `memory_messages_${dimensions}`;

    //await this.vector.createIndex({ indexName, dimension: dimensions });
    return { indexName, dimensions };
}

export const defaultEmbedder = fastEmbedProvider.textEmbeddingModel;
