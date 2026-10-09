/**
 * One place for every AI call Keel makes.
 *
 * Defaults to OpenRouter, so self-hosters can pick any model with one key.
 * Any OpenAI-compatible endpoint also works (OpenAI, Azure, a local Ollama, etc.)
 * by setting LLM_BASE_URL.
 *
 * Environment variables (set in the Convex dashboard):
 *   LLM_API_KEY   required
 *   LLM_MODEL     required, any model id from https://openrouter.ai/models
 *   LLM_BASE_URL  optional, defaults to OpenRouter
 *   APP_URL       optional, sent to OpenRouter to identify the app
 */

const OPENROUTER_URL = "https://openrouter.ai/api/v1";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chat(messages: ChatMessage[]): Promise<string> {
  const baseUrl = (process.env.LLM_BASE_URL || OPENROUTER_URL).replace(/\/$/, "");
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL;
  if (!apiKey || !model) {
    throw new Error("AI isn't configured yet. Set LLM_API_KEY and LLM_MODEL in the Convex dashboard.");
  }

  const isOpenRouter = baseUrl.startsWith(OPENROUTER_URL);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  if (isOpenRouter) {
    headers["X-Title"] = "Keel";
    if (process.env.APP_URL) headers["HTTP-Referer"] = process.env.APP_URL;
  }

  const body: Record<string, unknown> = { model, messages };
  // Manifesto #6: never route someone's reflections to providers that keep or train on them.
  if (isOpenRouter) body.provider = { data_collection: "deny" };

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`The guide couldn't respond right now (${res.status}).`);

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("The guide returned an empty response.");
  return text;
}
