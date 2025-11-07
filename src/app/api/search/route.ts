import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
<<<<<<< HEAD
import prisma from '@/lib/db';
import { vectorizeSearch } from '@/services/server/vectorizer';

type SearchRequest = {
  searchID: string;
};

const similarityOffset = 0.4;
const threshold = 0.12;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const manipulatedBody: SearchRequest = body;

  const query = decodeURIComponent(manipulatedBody.searchID);

  if (query) {
    const searchInput = await vectorizeSearch(query);
    const matches = await prisma.$queryRawUnsafe<
      { id: string; name: string; expertiseArea: string; similarity: number }[]
    >(
      `
        SELECT id, name, "expertiseArea",
            1 - ("expertiseVector" <=> $1::vector) AS similarity
        FROM "Organization"
        WHERE 
            "expertiseVector" IS NOT NULL
            AND (1 - ("expertiseVector" <=> $1::vector)) >= $2
        ORDER BY similarity DESC
        `,
      searchInput,
      similarityOffset
    );

    const highestSimilarity = matches[0]?.similarity;
    const filteredMatches = matches.filter(
      (match) => match.similarity >= highestSimilarity - threshold
    );
    console.log(filteredMatches);
    //console.log(matches)
    return NextResponse.json(filteredMatches, { status: 200 });
  }

  return NextResponse.json({ message: 'Something went wrong' }, { status: 400 });
=======

import { prisma } from '@/lib/db';

type SearchRequest = {
  searchTerm: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (typeof body !== 'object' || body === null) {
      return NextResponse.json(
        { error: 'Invalid request: Body has to be a JSON-object' },
        { status: 400 }
      );
    }

    const { searchTerm }: SearchRequest = body;

    if (!searchTerm) {
      return NextResponse.json(
        { error: 'Invalid request: Search term cannot be empty' },
        { status: 400 }
      );
    }

    // Enhanced search ranking logic
    const results = await prisma.$queryRaw`
      WITH search_words AS (
        SELECT unnest(string_to_array(lower(${searchTerm}), ' ')) as word
      )
      SELECT DISTINCT 
        o.id, 
        o.name, 
        o.description, 
        o."expertiseArea", 
        o.type, 
        o.email, 
        o.phone, 
        o.address, 
        o.website,
        GREATEST(
          CASE WHEN o."expertiseArea" ILIKE '%' || ${searchTerm} || '%' THEN 100 ELSE 0 END,
          CASE WHEN EXISTS (SELECT 1 FROM search_words WHERE o."expertiseArea" ILIKE '%' || word || '%') THEN 90 ELSE 0 END,
          CASE WHEN o.description ILIKE '%' || ${searchTerm} || '%' THEN 80 ELSE 0 END,
          CASE WHEN EXISTS (SELECT 1 FROM search_words WHERE o.description ILIKE '%' || word || '%') THEN 70 ELSE 0 END
        ) as rank
      FROM "Organization" o
      WHERE 
        o.description ILIKE '%' || ${searchTerm} || '%' OR
        o."expertiseArea" ILIKE '%' || ${searchTerm} || '%' OR
        EXISTS (
          SELECT 1 FROM search_words sw
          WHERE 
            o.description ILIKE '%' || sw.word || '%' OR
            o."expertiseArea" ILIKE '%' || sw.word || '%'
        )
      ORDER BY rank DESC, name ASC
      LIMIT 50
    `;

    return NextResponse.json(results);
  } catch (error) {
    console.error('Detaillied error:', error);

    // Check for JSON parsing errors
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return NextResponse.json({ error: 'Invalid JSON-format in the request' }, { status: 400 });
    }

    return NextResponse.json(
      {
        error: 'Internal server error during search',
        details: error instanceof Error ? error.message : 'unknown error',
      },
      { status: 500 }
    );
  }
>>>>>>> 8defdb7 (feat(serch): implemented first version of full text serch for field of law (#36))
}
