import prisma from '@/lib/db';
import { vectorizeSearch } from '@/services/server/vectorizer';

const similarityOffset = 0.4;
const threshold = 0.12;

export async function createSearch(query: string) {
  if (query) {
    const searchInput = await vectorizeSearch(query);

    const matches = await prisma.$queryRaw<
      { id: string; name: string; expertiseArea: string; description: string; similarity: number }[]
    >`
        SELECT id, name, "expertiseArea", "description",
            1 - ("expertiseVector" <=> ${searchInput}::vector) AS similarity
        FROM "Organization"
        WHERE 
            "expertiseVector" IS NOT NULL
            AND (1 - ("expertiseVector" <=> ${searchInput}::vector)) >= ${similarityOffset}
        ORDER BY similarity DESC
        `;

    const highestSimilarity = matches[0]?.similarity;
    const filteredMatches = matches.filter(
      (match) => match.similarity >= highestSimilarity - threshold
    );

    // eslint-disable-next-line no-console
    console.log(filteredMatches);

    return filteredMatches;
  } else {
    return null;
  }
}
