import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createSearch } from './services';

type SearchRequest = {
  searchID: string;
};

// const similarityOffset = 0.4;
// const threshold = 0.12;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const manipulatedBody: SearchRequest = body;

  const query = decodeURIComponent(manipulatedBody.searchID);
  const filteredMatches = await createSearch(query);

  // if (query) {
  //   const searchInput = await vectorizeSearch(query);

  //   const matches = await prisma.$queryRaw<
  //     { id: string; name: string; expertiseArea: string; description: string; similarity: number }[]
  //   >`
  //       SELECT id, name, "expertiseArea", "description",
  //           1 - ("expertiseVector" <=> ${searchInput}::vector) AS similarity
  //       FROM "Organization"
  //       WHERE
  //           "expertiseVector" IS NOT NULL
  //           AND (1 - ("expertiseVector" <=> ${searchInput}::vector)) >= ${similarityOffset}
  //       ORDER BY similarity DESC
  //       `;

  //   const highestSimilarity = matches[0]?.similarity;
  //   const filteredMatches = matches.filter(
  //     (match) => match.similarity >= highestSimilarity - threshold
  //   );
  //   // eslint-disable-next-line no-console
  //   console.log(filteredMatches);
  //   //console.log(matches)
  //   return NextResponse.json(filteredMatches, { status: 200 });
  // }

  if (filteredMatches) {
    return NextResponse.json(filteredMatches, { status: 200 });
  } else {
    return NextResponse.json({ message: 'Something went wrong' }, { status: 400 });
  }
}
