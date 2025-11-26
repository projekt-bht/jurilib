/* eslint-disable no-console */
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

async function createEmbedding(input: string): Promise<number[]> {
    const embeddingResponse = await openai.embeddings.create({
        model: embeddingModel,
        input,
    });

    return embeddingResponse.data[0].embedding;
}

export async function vectorizeSearch(query: string): Promise<number[]> {
    const expansionPrompt = `
    Versuche bitte diesen Text zu juristschen rechtlichen Fachgebieten zuzuordnen, bzw. wo das hingehören könnte.
    BEISPIEL: Strafrecht, Verkehrsrecht, Mietercht, Zivilrecht, Arbeitsrecht und so weiter ...
    Gib bitte nur die Fachgebiete als antwort zurück, falls du nichts sinnvolles findest gib einfach '#' das zurück

    "${query}"
    `;

    /*
      System role: Allows you to specify the way the model answers questions. Classic example: “You are a helpful assistant.”
      User role: Equivalent to the queries made by the user.
      Assistant role: are the model’s responses (based on the user messages)
    */
    const expansion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: 'system', content: "Du bist ein juristisch versiertes Modell" },
            { role: "user", content: expansionPrompt },
        ],
    });

    const expandedQuery = expansion?.choices[0].message.content?.trim() ?? query;
    console.log("Original:", query);
    console.log("Expanded:", expandedQuery);

    return createEmbedding(expandedQuery);
}

export async function vectorizeExpertiseArea(query: string): Promise<number[]> {
    console.log(query);
    return createEmbedding(query);
}

export async function vectoriseData(query: string): Promise<number[]> {
    return createEmbedding(query);
}
