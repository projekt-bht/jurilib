import prisma from '@/lib/db';

export async function getCasesByUser(userID: string) {
  try {
    const createdCase = await prisma.case.findMany({
      where: { userId: userID },
    });
    return createdCase;
  } catch (error) {
    throw new Error('Database insert failed: ' + (error as Error).message);
  }
}
