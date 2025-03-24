# Car Recommendation Agent with Memory

An intelligent car recommendation agent that remembers past recommendations and
can recall them by date or context.

## Features

- Interactive car recommendations based on user needs
- Persistent memory of all recommendations
- Query past recommendations by date or context
- Automatic semantic search using LibSQL vector store
- Built with Mastra.ai framework

## Setup

1. Install dependencies:

```bash
bun install
```

2. Start the agent:

```bash
bun run dev
```

## Usage

1. Chat with the agent about your car needs
2. Get personalized recommendations
3. Ask about past recommendations:
   - "What car did you recommend on [date]?"
   - "What similar cars have you recommended before?"
   - "What was your recommendation last Friday?"

## Technical Details

- Uses Mastra's Memory system with LibSQL for storage
- FastEmbed (bge-small-en-v1.5) for semantic embeddings
- Automatic metadata tracking with timestamps
- Semantic search for context-based queries
