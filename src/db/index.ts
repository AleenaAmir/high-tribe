import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Database connection configuration
const DB_CONFIG = {
    user: 'postgres',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database: 'highTribe',
    ssl: false
};

// Create a PostgreSQL connection pool
const pool = new Pool(DB_CONFIG);

// Create a Drizzle ORM instance
export const db = drizzle(pool, { schema });

// Export the pool for direct database access if needed
export { pool };
