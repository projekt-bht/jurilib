/* eslint-disable no-console */
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL ?? '',
  apiKey: process.env.OPENAI_API_KEY ?? '',
  defaultHeaders: {
    'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
    'X-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
  },
});

export async function vectorizeSearch(query: string) {
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
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Du bist ein juristisch versiertes Modell' },
      { role: 'user', content: expansionPrompt },
    ],
  });

  const expandedQuery = expansion?.choices[0].message.content?.trim() ?? query;
  console.log('Original:', query);
  console.log('Expanded:', expandedQuery);

  const embeddingResponse = await openai.embeddings.create({
    model: 'openai/text-embedding-3-large',
    input: expandedQuery,
  });

  const embedding = embeddingResponse.data[0].embedding;
  // Format numeric embedding array as string
  // needed atm, since prisma v7 internally converts arrays to JSON objects. To fix this we convert the array to a string here.
  return `[${embedding.join(',')}]`;
}

export async function vectorizeExpertiseArea(query: string) {
  //   console.log(query);
  const embeddingResponse = await openai.embeddings.create({
    model: 'openai/text-embedding-3-large',
    input: query,
  });

  // Format numeric embedding array as string
  const embedding = embeddingResponse.data[0].embedding;
  return `[${embedding.join(',')}]`;
}
