import prisma from '@/lib/db';
import { vectorizeSearch } from '@/services/server/vectorizer';
import type { Areas, OrganizationType, PriceCategory } from '~/generated/prisma/client';
import type { Organization } from '~/generated/prisma/client';

const similarityOffset = 0.4;
const threshold = 0.12;

export async function createSearch(query: string) {
  if (query) {
    const searchInput = await vectorizeSearch(query);

    const matches = await prisma.$queryRaw<
      Array<{
        name: string;
        id: string;
        description: string | null;
        shortDescription: string;
        email: string;
        phone: string | null;
        address: string | null;
        website: string | null;
        expertiseArea: Areas[];
        expertiseVector: string;
        type: OrganizationType;
        priceCategory: PriceCategory;
        createdAt: Date;
        updatedAt: Date;
        similarity: number;
      }>
    >`
      SELECT
      *, 
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

    // Transformiere expertiseArea zu einem String und entferne similarity
    const transformedMatches: Organization[] = filteredMatches.map((match) => {
      const { similarity, expertiseVector, ...rest } = match;
      return {
        ...rest,
        expertiseArea: Array.isArray(match.expertiseArea)
          ? match.expertiseArea // Bereits Array: belasse es
          : (String(match.expertiseArea)
              .replace(/{|}/g, '') // Entferne {}
              .split(',') // Splitte durch ,
              .map((s: string) => s.trim()) // Trimme
              .filter((s: string) => s) as Areas[]), // Entferne leere Strings
      };
    });

    // eslint-disable-next-line no-console
    console.log(transformedMatches);

    return transformedMatches;
  } else {
    return null;
  }
}
