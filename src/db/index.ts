import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}

// Database connection configuration
const DB_CONFIG = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false
};

// Create a PostgreSQL connection pool
const pool = new Pool(DB_CONFIG);

// Add error handling for the pool
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Test the connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to the database:', {
            message: err.message,
            stack: err.stack
        });
        return;
    }
    console.log('Successfully connected to database');
    release();
});

// Create a Drizzle ORM instance
export const db = drizzle(pool, { schema });

// Export the pool for direct database access if needed
export { pool };
