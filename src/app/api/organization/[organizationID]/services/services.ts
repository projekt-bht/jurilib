import { ValidationError } from '@/error/validationErrors';
import prisma from '@/lib/db';
import type { Service } from '~/generated/prisma/client';
import type { ServiceCreateInput } from '~/generated/prisma/models';

export async function createService(serviceBody: ServiceCreateInput) {
  try {
    const createdService = await prisma.service.create({
      data: serviceBody,
    });
    return createdService;
  } catch (error) {
    throw new Error('Database insert failed: ' + (error as Error).message);
  }
}

export async function readServices(organizationID: string): Promise<Service[]> {
  try {
    const services: Service[] | null = await prisma.service.findMany({
      where: { organizationId: organizationID },
    });
    if (!services) {
      throw new ValidationError('notFound', 'services', organizationID);
    }
    return services;
  } catch (error) {
    throw new Error('Database query failed: ' + (error as Error).message);
  }
}
