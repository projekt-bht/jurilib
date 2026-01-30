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
const threshold = 0.05;

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

  // Transform expertiseAreas to an array of strings and remove similarity
  const transformedMatches: Organization[] = filteredMatches.map((match) => {
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { similarity, expertiseVector, ...rest } = match;
    return {
      ...rest,
      expertiseAreas: Array.isArray(match.expertiseAreas)
        ? match.expertiseAreas // Go ahead if it's already an array
        : (String(match.expertiseAreas)
            .replace(/{|}/g, '') // remove { }
            .split(',') // Split by comma,
            .map((s: string) => s.trim()) // Trim
            .filter((s: string) => s) as Area[]), // Remove empty strings
    };
  });

  // eslint-disable-next-line no-console
  console.log(transformedMatches);

  return transformedMatches;
}
