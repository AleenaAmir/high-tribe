// // // import { drizzle } from 'drizzle-orm/node-postgres';
// // // import { Pool } from 'pg';
// // // import * as schema from './schema';
// // // import dotenv from 'dotenv';

// // // // Load environment variables
// // // dotenv.config();

// // // if (!process.env.DATABASE_URL) {
// // //     throw new Error('DATABASE_URL environment variable is not set');
// // // }

// // // // Parse the connection string
// // // const connectionString = process.env.DATABASE_URL;

// // // // Database connection configuration
// // // const DB_CONFIG = {
// // //     connectionString,
// // //     ssl: {
// // //         rejectUnauthorized: false
// // //     },
// // //     max: 1,
// // //     idleTimeoutMillis: 30000,
// // //     connectionTimeoutMillis: 2000,
// // //     keepAlive: true,
// // //     keepAliveInitialDelayMillis: 1000,
// // //     allowExitOnIdle: true
// // // };

// // // // Create a PostgreSQL connection pool
// // // const pool = new Pool(DB_CONFIG);

// // // // Add error handling for the pool
// // // pool.on('error', (err) => {
// // //     console.error('Unexpected error on idle client', err);
// // //     process.exit(-1);
// // // });

// // // // Test the connection
// // // pool.connect((err, client, release) => {
// // //     if (err) {
// // //         console.error('Error connecting to the database:', {
// // //             message: err.message,
// // //             stack: err.stack,
// // //             connectionString: connectionString.replace(/:[^:@]*@/, ':****@') // Hide password in logs
// // //         });
// // //         return;
// // //     }
// // //     console.log('Successfully connected to database');
// // //     release();
// // // });

// // // // Create a Drizzle ORM instance
// // // export const db = drizzle(pool, { schema });

// // // // Export the pool for direct database access if needed
// // // export { pool };

// // import 'dotenv/config'
// // import { drizzle } from 'drizzle-orm/postgres-js'
// // import postgres from 'postgres'
// // import * as schema from './schema'

// // if (!process.env.DATABASE_URL) {
// //     throw new Error('DATABASE_URL environment variable is not set');
// // }

// // // Parse the connection string and ensure it's using the direct connection format
// // let connectionString = process.env.DATABASE_URL;
// // if (connectionString.includes('db.')) {
// //     // Convert pooled connection to direct connection
// //     connectionString = connectionString.replace('db.', 'postgres.');
// // }

// // // Parse the connection URL to get components
// // const connectionUrl = new URL(connectionString);
// // console.log('Database connection details:', {
// //     host: connectionUrl.hostname,
// //     port: connectionUrl.port,
// //     database: connectionUrl.pathname.slice(1),
// //     user: connectionUrl.username,
// //     ssl: connectionUrl.hostname.includes('supabase.co')
// // });

// // // Database connection configuration
// // const client = postgres(connectionString, {
// //     ssl: connectionUrl.hostname.includes('supabase.co') ? {
// //         rejectUnauthorized: false
// //     } : undefined,
// //     max: 1,
// //     idle_timeout: 30,
// //     connect_timeout: 10,
// //     prepare: false,
// //     debug: true, // Enable debug mode to see connection details
// //     connection: {
// //         application_name: 'high-tribe-app'
// //     },
// //     transform: {
// //         undefined: null
// //     },
// //     max_lifetime: 60 * 30 // 30 minutes
// // });

// // // Test the connection
// // const testConnection = async () => {
// //     let retries = 0;
// //     const maxRetries = 3;

// //     while (retries < maxRetries) {
// //         try {
// //             await client`SELECT 1`;
// //             console.log('Successfully connected to database');
// //             return;
// //         } catch (error) {
// //             const err = error as Error;
// //             retries++;

// //             console.error(`Database connection attempt ${retries} failed:`, {
// //                 message: err.message,
// //                 stack: err.stack,
// //                 connectionString: connectionString.replace(/:[^:@]*@/, ':****@'), // Hide password in logs
// //                 hostname: connectionUrl.hostname,
// //                 port: connectionUrl.port,
// //                 database: connectionUrl.pathname.slice(1),
// //                 user: connectionUrl.username,
// //                 isLocal: connectionUrl.hostname === 'localhost'
// //             });

// //             if (retries === maxRetries) {
// //                 throw err;
// //             }

// //             // Wait before retrying with exponential backoff
// //             const delay = Math.min(1000 * Math.pow(2, retries), 10000);
// //             console.log(`Retrying in ${delay}ms...`);
// //             await new Promise(resolve => setTimeout(resolve, delay));
// //         }
// //     }
// // };

// // // Run the connection test
// // testConnection();

// // export const db = drizzle(client, { schema });
// // export { client };

// import { config } from 'dotenv';
// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
// import env from '../lib/env';
// import * as schema from './schema';
// config({ path: '.env' });

// const sql = postgres(env.DATABASE_URL!);

// const db = drizzle(sql, { schema });

// export { db };
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { dbConfig } from "./db-config"
import * as schema from "./schema"

let database: ReturnType<typeof drizzle> | null = null

function initDb() {
    if (!dbConfig.url) {
        throw new Error('Database URL is not configured. Please check your environment variables.')
    }

    const client = postgres(dbConfig.url, {
        max: 1,
        idle_timeout: 30,
        connect_timeout: 10,
        prepare: false,
        debug: process.env.NODE_ENV === 'development',
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    })

    // Test the connection
    client`SELECT 1`.catch((error) => {
        console.error('Failed to connect to database:', error)
        throw error
    })

    return drizzle(client, { schema })
}


export function databaseInstance() {
    if (!database) {
        try {
            database = initDb()
        } catch (error) {
            console.error('Failed to initialize database:', error)
            throw error
        }
    }
    return database
}
export const db = databaseInstance();

// Export a function to close the database connection
export async function closeDb() {
    if (database) {
        // @ts-ignore - postgres client has a close method
        await database.client?.close()
        database = null
    }
} 
