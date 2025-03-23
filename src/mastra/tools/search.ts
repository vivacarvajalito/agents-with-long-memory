import { search, SafeSearchType } from 'duck-duck-scrape';

interface SearchResult {
    title: string;
    description: string;
    url: string;
}

export const searchTool = {
    id: 'web_search',
    description: 'Search the web for information',
    parameters: {
        type: 'object',
        properties: {
            query: {
                type: 'string',
                description: 'The search query',
            },
        },
        required: ['query'],
    },
    execute: async ({ query }: { query: string }) => {
        console.log('Searching for:', query);
        try {
            const results = await search(query, {
                safeSearch: SafeSearchType.MODERATE,

            });

            const formattedResults = results.results
                .slice(0, 5)
                .map((r: SearchResult) => `- ${r.title}\n  ${r.description}\n  URL: ${r.url}`)
                .join('\n\n');

            return {
                searchResults: results.results.slice(0, 5),
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                text: `Error performing search: ${errorMessage}`,
            };
        }
    },
}; 