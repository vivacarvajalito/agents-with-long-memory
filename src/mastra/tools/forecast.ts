import { forecast } from 'duck-duck-scrape';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

interface ForecastResult {
    temp: number;
    desc: string;
    loc: string;
    text: string;
}

export const forecastTool = createTool({
    id: 'get-forecast',
    description: 'Get weather forecast using DuckDuckGo',
    inputSchema: z.object({
        location: z.string().describe('City name'),
    }),
    outputSchema: z.object({
        temperature: z.number(),
        conditions: z.string(),
        location: z.string(),
        forecast: z.string(),
    }),
    execute: async ({ context }) => {
        try {
            const rawResult = await forecast(context.location);
            if (!rawResult) {
                console.error('No forecast data available');
            }
            const result = rawResult as unknown as ForecastResult;
            return {
                temperature: result.temp ?? 0,
                conditions: result.desc ?? 'Unknown',
                location: result.loc ?? context.location,
                forecast: result.text ?? 'No forecast available',
            };
        } catch (error) {
            throw new Error(`Failed to get forecast: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
}); 