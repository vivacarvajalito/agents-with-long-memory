import { createTool } from "@mastra/core/tools";
import { Memory } from "@mastra/memory";
import { z } from "zod";
const memory = new Memory();

const memoryTool = createTool({
    id: "Thread Info Tool",
    inputSchema: z.object({
        fetchMessages: z.boolean().optional(),
    }),
    description: "A tool that demonstrates accessing thread and resource IDs",
    execute: async ({ threadId, resourceId, context }) => {
        // threadId and resourceId are directly available in the execute parameters
        console.log(`Executing in thread ${threadId}`, context);

        if (!context.fetchMessages) {
            return { threadId, resourceId };
        }
        if (!resourceId) {
            return { threadId, resourceId };
        }

        const threads = await memory.getThreadsByResourceId({ resourceId });
        console.log('threads', threads);

        if (!threads?.length) {
            return { threadId, resourceId };
        }

        const recentMessages = await memory.query({
            threadId: threads[0].id,
            resourceId,
            selectBy: { last: 5 },
        });

        return {
            threadId,
            resourceId,
            messageCount: recentMessages?.messages?.length,
        };
    },
});