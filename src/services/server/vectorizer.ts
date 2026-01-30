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

export type VectorFormat = {
  area: string;
  city?: string;
  zipCode?: string;
  description?: string;
};

//https://openrouter.ai/docs/guides/features/structured-outputs
export async function vectorizeSearch(query: string): Promise<VectorFormat> {
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
                'Ordne den Text genau einem juristischen Fachgebiet zu, nur wenn eindeutig vorhanden, sonst null',
            },
            city: {
              type: 'string',
              description:
                'Gebe die Stadt aus dem Text zurück, **nur wenn eine gültige Stadt oder PLZ vorhanden ist**, sonst null',
            },
            zipCode: {
              type: 'string',
              description:
                'Gebe die Postleitzahl aus dem Text zurück, **nur wenn eine gültige PLZ vorhanden ist**, sonst null',
            },
            description: {
              type: 'string',
              description: 'Extrahiere relevante juristische Buzzwords, sonst null.',
            },
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

  const parsedQuery: VectorFormat = JSON.parse(expandedQuery);

  const responseEmbedding: VectorFormat = {
    area: await createEmbedding(parsedQuery.area),
  };

  if (parsedQuery.city) {
    responseEmbedding.city = await createEmbedding(parsedQuery.city);
  }

  if (parsedQuery.zipCode) {
    responseEmbedding.zipCode = await createEmbedding(parsedQuery.zipCode);
  }

  if (parsedQuery.description) {
    responseEmbedding.description = await createEmbedding(parsedQuery.description);
  }

  // Format numeric embedding array as string
  // needed atm, since prisma v7 internally converts arrays to JSON objects. To fix this we convert the array to a string here.
  return responseEmbedding;
}

export async function createEmbedding(query: string) {
  const embeddingResponse = await openai.embeddings.create({
    model: 'openai/text-embedding-3-large',
    input: query,
  });
  return `[${embeddingResponse.data[0].embedding.join(',')}]`;
}

export async function extractBuzzwords(query: string) {
  const expansion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'Extrahiere nur die relevanten juristischen Buzzwords aus dem Prompt (Kanzlei Beschreibung), halluziniere keine dazu!',
      },
      {
        role: 'user',
        content: query,
      },
    ],
  });
  return expansion.choices[0].message.content;
}
