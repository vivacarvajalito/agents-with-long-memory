# Car Recommendation Agent with Memory

An intelligent car recommendation agent built with Mastra.ai that demonstrates
advanced AI capabilities through long-term memory and contextual awareness.

## Project Overview

This project showcases the power of AI agents with persistent memory in a
real-world application. The agent:

- Provides personalized car recommendations based on user requirements
- Maintains long-term memory of all interactions and recommendations
- Can recall past recommendations through semantic search
- Uses Mastra's network capabilities for intelligent agent routing
- Demonstrates practical implementation of AI memory systems

## Setup

1. Install Node.js:
   - Required: Node.js v22 LTS
   - Download from: https://nodejs.org/

2. Install dependencies:

```bash
npm install
```

3. Create `.env.development`:

```env
# Choose one:
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
# OR
OPENAI_API_KEY=your_openai_api_key
```

4. Start the agent:

```bash
npm run dev
```

## Usage

1. Chat with the agent about your car needs
2. Get personalized recommendations
3. Ask about past recommendations:
   - "What car did you recommend on [date]?"
   - "What similar cars have you recommended before?"
   - "What was your recommendation last Friday?"

## Technical Implementation

- **Agent Network**: Uses Mastra's network capabilities to route queries to
  specialized agents
- **Long-term Memory**:
  - LibSQL vector store for semantic search
  - FastEmbed (bge-small-en-v1.5) for embeddings
  - Persistent storage of all recommendations
- **Semantic Search**: Enables natural language queries about past
  recommendations
- **Metadata Tracking**: Automatically stores timestamps and context

## Project Goals

This project demonstrates key AI capabilities required for the AI Academy:

1. **Agent Networks**: Shows understanding of multi-agent systems
2. **Memory Systems**: Implements persistent memory for AI agents
3. **Natural Language**: Handles complex queries about past interactions
4. **Real-world Application**: Practical use case with car recommendations

The project is actively being developed to showcase how AI agents can maintain
context over long periods, making it an ideal demonstration of advanced AI
capabilities.
