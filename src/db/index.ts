// import { drizzle } from 'drizzle-orm/node-postgres';
// import { Pool } from 'pg';
// import * as schema from './schema';
// import dotenv from 'dotenv';

// // Load environment variables
// dotenv.config();

// if (!process.env.DATABASE_URL) {
//     throw new Error('DATABASE_URL environment variable is not set');
// }

// // Parse the connection string
// const connectionString = process.env.DATABASE_URL;

// // Database connection configuration
// const DB_CONFIG = {
//     connectionString,
//     ssl: {
//         rejectUnauthorized: false
//     },
//     max: 1,
//     idleTimeoutMillis: 30000,
//     connectionTimeoutMillis: 2000,
//     keepAlive: true,
//     keepAliveInitialDelayMillis: 1000,
//     allowExitOnIdle: true
// };

// // Create a PostgreSQL connection pool
// const pool = new Pool(DB_CONFIG);

// // Add error handling for the pool
// pool.on('error', (err) => {
//     console.error('Unexpected error on idle client', err);
//     process.exit(-1);
// });

// // Test the connection
// pool.connect((err, client, release) => {
//     if (err) {
//         console.error('Error connecting to the database:', {
//             message: err.message,
//             stack: err.stack,
//             connectionString: connectionString.replace(/:[^:@]*@/, ':****@') // Hide password in logs
//         });
//         return;
//     }
//     console.log('Successfully connected to database');
//     release();
// });

// // Create a Drizzle ORM instance
// export const db = drizzle(pool, { schema });

// // Export the pool for direct database access if needed
// export { pool };

import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}

// Parse the connection string and ensure it's using the direct connection format
let connectionString = process.env.DATABASE_URL;
if (connectionString.includes('db.')) {
    // Convert pooled connection to direct connection
    connectionString = connectionString.replace('db.', 'postgres.');
}

// Database connection configuration
const client = postgres(connectionString, {
    ssl: {
        rejectUnauthorized: false
    },
    max: 1,
    idle_timeout: 30,
    connect_timeout: 10,
    prepare: false,
    debug: true // Enable debug mode to see connection details
});

// Test the connection
const testConnection = async () => {
    try {
        await client`SELECT 1`;
        console.log('Successfully connected to database');
    } catch (error) {
        const err = error as Error;
        console.error('Error connecting to the database:', {
            message: err.message,
            stack: err.stack,
            connectionString: connectionString.replace(/:[^:@]*@/, ':****@') // Hide password in logs
        });
        throw err; // Re-throw to prevent the app from starting with a bad connection
    }
};

// Run the connection test
testConnection();

export const db = drizzle(client, { schema });
export { client };