import config from "./config";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { info } from "@actions/core";
import { z } from "zod";

const LLM_MODELS = [
  // Anthropic
  {
    name: "claude-3-5-sonnet-20240620",
    createAi: createAnthropic,
  },
  {
    name: "claude-3-5-sonnet-20241022",
    createAi: createAnthropic,
  },
  // OpenAI
  {
    name: "gpt-4o-mini",
    createAi: createOpenAI,
  },
  {
    name: "o3-mini",
    createAi: createOpenAI,
  },
  // Google
  {
    name: "gemini-1.5-flash",
    createAi: createGoogleGenerativeAI,
  },
  {
    name: "gemini-1.5-flash-latest",
    createAi: createGoogleGenerativeAI,
  },
];

export async function runPrompt({
  prompt,
  systemPrompt,
  schema,
}: {
  prompt: string;
  systemPrompt?: string;
  schema: z.ZodObject<any, any>;
}) {
  const model = LLM_MODELS.find((m) => m.name === config.llmModel);
  if (!model) {
    throw new Error(`Unknown LLM model: ${config.llmModel}`);
  }

  const llm = model.createAi({ apiKey: config.llmApiKey });
  const { object, usage } = await generateObject({
    model: llm(model.name),
    prompt,
    system: systemPrompt,
    schema,
  });

  if (process.env.DEBUG) {
    info(`usage: \n${JSON.stringify(usage, null, 2)}`);
  }

  return object;
}
