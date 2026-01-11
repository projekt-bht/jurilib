import prisma from '@/lib/db';
import type { Service } from '~/generated/prisma/client';

export async function readServices(organizationID: string): Promise<Service[]> {
  try {
    const services: Service[] | null = await prisma.service.findMany({
      where: { organizationId: organizationID },
    });
    if (!services) {
      throw new Error('No Services for given organization found.');
    }
    return services;
  } catch (error) {
    throw new Error('Database query failed: ' + (error as Error).message);
  }
}
