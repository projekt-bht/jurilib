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

    const results = await prisma.organization.findMany({
      where: {
        expertiseArea: {
          contains: searchTerm,
          mode: 'insensitive',
        },
        // Alternative: to search in multiple fields
        /**
        OR: [
            {
                name: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            },
            {
                description: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            },
            {
                expertiseArea: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }
        ]
         */
      },
      // Selection of fields that are returned in JSON response
      select: {
        id: true,
        name: true,
        description: true,
        expertiseArea: true,
        type: true,
        email: true,
        phone: true,
        address: true,
        website: true,
      },
    });

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
