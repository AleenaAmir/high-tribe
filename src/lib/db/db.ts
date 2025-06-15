import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import env from '../env';
import * as schema from './schema';
config({ path: '.env' });

const sql = postgres(env.DATABASE_URL!);

const db = drizzle(sql, { schema });

export { db };