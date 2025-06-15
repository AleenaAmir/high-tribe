import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}

// Parse the connection string
const connectionString = process.env.DATABASE_URL;

// Database connection configuration
const DB_CONFIG = {
    connectionString,
    ssl: {
        rejectUnauthorized: false
    },
    max: 1, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000, // How long to wait for a connection
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
