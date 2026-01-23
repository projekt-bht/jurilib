import prisma from '@/lib/db';
import type { ServiceUpdateInput } from '~/generated/prisma/models';

export async function updateService(serviceID: string, serviceBody: ServiceUpdateInput) {
  try {
    const updatedService = await prisma.service.update({
      where: { id: serviceID },
      data: serviceBody,
    });
    return updatedService;
  } catch (error) {
    throw new Error('Database insert failed: ' + (error as Error).message);
  }
}

export async function deleteService(serviceID: string) {
  try {
    await prisma.service.delete({ where: { id: serviceID } });
  } catch (error) {
    throw new Error('Service deletion failed: ' + (error as Error).message);
  }
}
