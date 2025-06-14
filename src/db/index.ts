import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

// Use env variables to build config
const DB_CONFIG = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true'
};

// Create PostgreSQL pool
const pool = new Pool(DB_CONFIG);

// Drizzle instance
export const db = drizzle(pool, { schema });
export { pool };
