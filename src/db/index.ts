import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Database connection configuration
const DB_CONFIG = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false
};

// Create a PostgreSQL connection pool
const pool = new Pool(DB_CONFIG);

// Create a Drizzle ORM instance
export const db = drizzle(pool, { schema });

// Export the pool for direct database access if needed
export { pool };
