import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
  defaultHeaders: {
    'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
    'X-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
  },
});

async function vectoriseData(query : string) : Promise<number[]> {
    const embeddingResponse = await openai.embeddings.create({
        model: "openai/text-embedding-3-large",
        input: query,
    });
    //console.log(embeddingResponse.data[0].embedding)
    return embeddingResponse.data[0].embedding
}

export default vectoriseData