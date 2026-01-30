/* eslint-disable no-console */
import OpenAI from 'openai';

import { Area } from '~/generated/prisma/enums';

const openai = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL ?? '',
  apiKey: process.env.OPENAI_API_KEY ?? '',
  defaultHeaders: {
    'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
    'X-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
  },
});

//https://openrouter.ai/docs/guides/features/structured-outputs
export async function vectorizeSearch(query: string) {
  const possibleAreas = Object.values(Area);
  /*
      System role: Allows you to specify the way the model answers questions. Classic example: “You are a helpful assistant.”
      User role: Equivalent to the queries made by the user.
      Assistant role: are the model’s responses (based on the user messages)
    */
  const expansion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'Du bist ein juristisch versiertes Modell. Ordne den kommenden User Prompt genau EINEM der juristischen Fachgebiet zu.' +
          possibleAreas.join(', ') +
          '. Falls der Prompt nicht juristisch ist, gib "#" zurück.',
      },
      {
        role: 'user',
        content: query,
      },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'expertise_area',
        schema: {
          type: 'object',
          properties: {
            area: {
              type: 'string',
              enum: [...possibleAreas, '#'],
              description:
                'Ordne den Text genau einem juristischen Fachgebiet zu. Falls keines passt, gib "#" zurück.',
            },
            city: {
              type: 'string',
              description:
                'Gebe die Stadt aus dem Text zurück, **nur wenn eine gültige Stadt oder PLZ vorhanden ist**, sonst "#".',
            },
            zipCode: {
              type: 'string',
              description:
                'Gebe die Postleitzahl aus dem Text zurück, **nur wenn eine gültige PLZ vorhanden ist**, sonst "#".',
            },
            /*Unsafe?
            shortDescription: {
              type: 'string',
              description:
                'Generiere eine ShortDescription der Kanzlei in 1–2 Sätzen, die beschreibt, wie diese Kanzlei beim User-Problem helfen könnte.',
            },*/
          },
          required: ['area'],
          additionalProperties: false,
        },
      },
    },
    stream: false,
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
