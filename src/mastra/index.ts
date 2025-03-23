import { Mastra } from '@mastra/core';
import { createLogger } from '@mastra/core/logger';
import { researchNetwork } from './network';
import { webSearchAgent, analysisAgent, factCheckAgent, weatherAgent, todoAgent } from './agents';

export const mastra = new Mastra({
  agents: {
    webSearchAgent,
    analysisAgent,
    factCheckAgent,
    weatherAgent,
    todoAgent,
  },
  networks: {
    researchNetwork,
  },
  logger: createLogger({ name: 'Research', level: 'info' }),
});
