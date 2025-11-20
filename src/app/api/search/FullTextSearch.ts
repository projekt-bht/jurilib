import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';

type SearchRequest = {
  searchTerm: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // validate body and searchTerm
    if (typeof body !== 'object' || body === null) {
      return invalidBodyResponse();
    }

    const { searchTerm }: SearchRequest = body;

    if (!searchTerm) {
      return missingSearchTermResponse();
    }

    // Full-text style search with manual ranking logic
    // The query splits the search term into individual words
    // and ranks matches based on where and how well they match.
    const results = await prisma.$queryRaw`
      WITH search_words AS (
        -- Split the search term into lowercase words for partial 
        -- matching and save them in a temporary table to simplify matching
        SELECT unnest(string_to_array(lower(${searchTerm}), ' ')) as word
      )
      -- ensure distinct results in case of multiple word matches
      SELECT DISTINCT 
        -- Fields to return
        o.id, 
        o.name, 
        o.description, 
        o."expertiseArea", 
        o.type, 
        o.email, 
        o.phone, 
        o.address, 
        o.website,
        -- Ranking logic: saves highest applicable rank per organization
        GREATEST(
          -- Exact expertiseArea match with full search term
          CASE WHEN o."expertiseArea" ILIKE '%' || ${searchTerm} || '%' THEN 100 ELSE 0 END,
          -- expertiseArea matches at least one individual search word
          CASE WHEN EXISTS (SELECT 1 FROM search_words WHERE o."expertiseArea" ILIKE '%' || word || '%') THEN 90 ELSE 0 END,
          -- Full search term match inside description
          CASE WHEN o.description ILIKE '%' || ${searchTerm} || '%' THEN 80 ELSE 0 END,
          -- Partial match of search words inside description
          CASE WHEN EXISTS (SELECT 1 FROM search_words WHERE o.description ILIKE '%' || word || '%') THEN 70 ELSE 0 END
        ) as rank
      FROM "Organization" o
      -- Filter to only rank relevant organizations
      WHERE 
        -- Match full searchTerm inside description or expertiseArea
        o.description ILIKE '%' || ${searchTerm} || '%' OR
        o."expertiseArea" ILIKE '%' || ${searchTerm} || '%' OR
        -- Match any individual search word inside either field
        EXISTS (
          SELECT 1 FROM search_words sw
          WHERE 
            o.description ILIKE '%' || sw.word || '%' OR 
            o."expertiseArea" ILIKE '%' || sw.word || '%'
        )
      -- order results by rank and name
      ORDER BY 
        rank DESC, -- Prioritize stronger matches
        name ASC   -- Alphabetical fallback for consistent ordering
      LIMIT 50
    `;

    return NextResponse.json(results);
  } catch (error) {
    console.error('Detaillied error:', error);

    // Check for JSON parsing errors
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return invalidJSONResponse();
    }

    return defaultErrorResponse(error);
  }
}

// Helper response functions

function invalidBodyResponse() {
  return NextResponse.json(
    { error: 'Invalid request: Body has to be a JSON-object' },
    { status: 400 }
  );
}

function missingSearchTermResponse() {
  return NextResponse.json(
    { error: 'Invalid request: Search term cannot be empty' },
    { status: 400 }
  );
}

function invalidJSONResponse() {
  return NextResponse.json({ error: 'Invalid JSON-format in the request' }, { status: 400 });
}

function defaultErrorResponse(error: unknown) {
  return NextResponse.json(
    {
      error: 'Internal server error during search',
      details: error instanceof Error ? error.message : 'unknown error',
    },
    { status: 500 }
  );
}
