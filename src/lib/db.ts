// Driver Adapter for Postgres
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '~/generated/prisma/client';

// Prisma Client singleton to prevent multiple instances in development
declare global {
  var prisma: PrismaClient | undefined;
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = global.prisma ?? new PrismaClient({ adapter });
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
