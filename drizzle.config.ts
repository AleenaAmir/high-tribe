import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import env from './src/lib/env';
dotenv.config();

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
} satisfies Config; 

