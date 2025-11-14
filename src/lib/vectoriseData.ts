import OpenAI from "openai";

const baseURL = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
const apiKey = process.env.OPENAI_API_KEY ?? "";

const defaultHeaders =
    baseURL.includes("openrouter") && process.env.OPENAI_REFERRER
        ? {
            "HTTP-Referer": process.env.OPENAI_REFERRER,
            "X-Title": process.env.OPENAI_APP_TITLE ?? "JuriLib",
        }
        : undefined;

const openai = new OpenAI({
    baseURL,
    apiKey,
    defaultHeaders,
});

const embeddingModel =
    process.env.OPENAI_EMBEDDING_MODEL ??
    (baseURL.includes("openrouter")
        ? "openai/text-embedding-3-large"
        : "text-embedding-3-large");

export default async function vectoriseData(query: string): Promise<number[]> {
    const embeddingResponse = await openai.embeddings.create({
        model: embeddingModel,
        input: query,
    });

    return embeddingResponse.data[0].embedding;
}
