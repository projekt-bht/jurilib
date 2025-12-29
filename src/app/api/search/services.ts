import prisma from '@/lib/db';
import { vectorizeSearch } from '@/services/server/vectorizer';
import type {
  Accessibility,
  Area,
  OrganizationType,
  PriceCategory,
} from '~/generated/prisma/client';
import type { Organization } from '~/generated/prisma/client';

const similarityOffset = 0.8;
const threshold = 0.12;

export async function createSearch(query: string) {
  const searchInput = await vectorizeSearch(query);

  const matches = await prisma.$queryRaw<
    Array<{
      /* Organization fields */
      id: string;
      name: string;
      description: string;
      shortDescription: string;
      email: string;
      phone: string | null;
      website: string | null;
      imageUrl: string | null;
      accessibility: Accessibility[];
      expertiseAreas: Area[];

      type: OrganizationType;
      priceCategory: PriceCategory;

      country: string;
      city: string;
      zipCode: string;
      street: string;
      houseNumber: string;

      averageRating: number;
      numberOfRatings: number;

      createdAt: Date;
      updatedAt: Date;

      expertiseVector: string;

      /* Internal use for similarity calculation */
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
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { similarity, expertiseVector, ...rest } = match;
    return {
      ...rest,
      expertiseAreas: Array.isArray(match.expertiseAreas)
        ? match.expertiseAreas // Bereits Array: belasse es
        : (String(match.expertiseAreas)
            .replace(/{|}/g, '') // Entferne {}
            .split(',') // Splitte durch ,
            .map((s: string) => s.trim()) // Trimme
            .filter((s: string) => s) as Area[]), // Entferne leere Strings
    };
  });

  // eslint-disable-next-line no-console
  console.log(transformedMatches);

  return transformedMatches;
}
