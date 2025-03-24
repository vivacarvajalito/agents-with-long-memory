import { Memory } from '@mastra/memory';
import { LibSQLStore } from "@mastra/core/storage/libsql";
import { LibSQLVector } from "@mastra/core/vector/libsql";

export const memory = new Memory({
    options: {
        workingMemory: {
            enabled: true,
        },
        lastMessages: 200,
        semanticRecall: {
            topK: 3,
            messageRange: {
                before: 2,
                after: 1,
            },
        },
    },
    storage: new LibSQLStore({
        config: {
            url: "file:x_memory.db",
        },
    }),
    vector: new LibSQLVector({
        connectionUrl: "file:x_vector.db",
    }),
}); 