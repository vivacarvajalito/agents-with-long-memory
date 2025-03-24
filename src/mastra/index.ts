import { Mastra } from '@mastra/core';
import { createLogger } from '@mastra/core/logger';
import { researchNetwork } from './network';
import { webSearchAgent, analysisAgent, factCheckAgent, weatherAgent, todoAgent, carAgent } from './agents';

export const mastra = new Mastra({
  agents: {
    webSearchAgent,
    analysisAgent,
    factCheckAgent,
    weatherAgent,
    todoAgent,
    carAgent,
  },
  networks: {
    researchNetwork,
  },
  logger: createLogger({ name: 'Research', level: 'info' }),
});
