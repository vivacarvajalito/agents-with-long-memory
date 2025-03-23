import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { LanguageModel } from "@mastra/core";

let model: LanguageModel;

if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    model = google('gemini-2.0-flash-lite', {});
} else if (process.env.OPENAI_API_KEY) {
    model = openai('gpt-4o');
} else {
    throw new Error('No API key found');
}

export { model as basicModel };