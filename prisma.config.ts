import { defineConfig, env } from 'prisma/config';
import 'dotenv/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  experimental: {
    extensions: true,
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
