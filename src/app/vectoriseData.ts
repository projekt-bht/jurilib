import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
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