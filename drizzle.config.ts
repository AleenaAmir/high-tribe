// import { config } from 'dotenv';
// import { defineConfig } from 'drizzle-kit';
// import env from './src/lib/env';

// if (!process.env.DATABASE_URL) {
//     throw new Error('No process.env.DATABASE_URL found');
// }
// config();

// export default defineConfig({
//     out: './drizzle/migrations',
//     schema: './src/db/schema.ts',
//     dialect: 'postgresql',
//     dbCredentials: {
//         url: env.DATABASE_URL,
//     },
// });
import { defineConfig } from "drizzle-kit"
import { dbConfig } from "./src/db/db-config"

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: dbConfig.url,
    },
    verbose: true,
    strict: true,
})