
// Construct database URL from individual parameters if DATABASE_URL is not provided
export const getDatabaseUrl = () => {
    return process.env.DATABASE_URL || `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
}
// Export individual config values for flexibility
export const dbConfig = {
    url: getDatabaseUrl(),
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
}






