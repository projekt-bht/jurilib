import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
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
}
