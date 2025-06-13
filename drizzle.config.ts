import { config } from 'dotenv';
import type { Config } from 'drizzle-kit';
import env from './src/lib/env';

if (!process.env.DATABASE_URL) {
    throw new Error('No process.env.DATABASE_URL found');
}
config();

// Parse the DATABASE_URL to get individual components
const dbUrl = new URL(env.DATABASE_URL);

export default {
    schema: './src/db/schema.ts',
    out: './drizzle/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        host: dbUrl.hostname,
        port: parseInt(dbUrl.port),
        user: dbUrl.username,
        password: dbUrl.password,
        database: dbUrl.pathname.slice(1),
        ssl: false
    },
} satisfies Config;
