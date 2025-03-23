import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { weatherTool } from './weather';
import { forecastTool } from './forecast';

export const weatherCompareTool = createTool({
    id: 'compare-weather',
    description: 'Compare weather data from multiple sources',
    inputSchema: z.object({
        location: z.string().describe('City name'),
    }),
    outputSchema: z.object({
        openMeteoSummary: z.string(),
        duckDuckGoSummary: z.string(),
        comparison: z.string(),
    }),
    execute: async ({ context }) => {

        try {
            if (!weatherTool?.execute || !forecastTool?.execute) {
                throw new Error('Weather tools not properly initialized');
            }
            const [openMeteoData, ddgData] = await Promise.all([
                weatherTool.execute({ context }),
                forecastTool.execute({ context }),
            ]);

            const openMeteoSummary = `OpenMeteo: ${openMeteoData.temperature}°C, feels like ${openMeteoData.feelsLike}°C, ${openMeteoData.conditions} in ${openMeteoData.location}. Wind: ${openMeteoData.windSpeed}km/h (gusts: ${openMeteoData.windGust}km/h), Humidity: ${openMeteoData.humidity}%`;

            const duckDuckGoSummary = `DuckDuckGo: ${ddgData.temperature}°C, ${ddgData.conditions} in ${ddgData.location}. ${ddgData.forecast}`;

            const tempDiff = Math.abs(openMeteoData.temperature - ddgData.temperature);
            const comparison = `Temperature difference: ${tempDiff.toFixed(1)}°C. ` +
                `Both sources ${openMeteoData.conditions.toLowerCase() === ddgData.conditions.toLowerCase() ? 'agree on' : 'differ on'} weather conditions.`;

            return {
                openMeteoSummary,
                duckDuckGoSummary,
                comparison,
            };
        } catch (error) {
            throw new Error(`Failed to compare weather: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
}); 