import { Pool } from 'pg';

// Database connection configuration
const DB_CONFIG = {
    user: 'postgres',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database: 'highTribe',
    ssl: false
};

// First connect to postgres database to create our database if it doesn't exist
const postgresPool = new Pool({
    ...DB_CONFIG,
    database: 'postgres' // Connect to default postgres database first
});

async function createDatabase() {
    try {
        // Check if database exists
        const result = await postgresPool.query(
            "SELECT 1 FROM pg_database WHERE datname = 'highTribe'"
        );

        if (result.rowCount === 0) {
            // Create database if it doesn't exist
            await postgresPool.query('CREATE DATABASE "highTribe"');
            console.log('Database created successfully');
        } else {
            console.log('Database already exists');
        }
    } catch (error) {
        console.error('Error creating database:', error);
        throw error;
    } finally {
        await postgresPool.end();
    }
}

// Then connect to our database to create tables
const pool = new Pool(DB_CONFIG);

export async function setupDatabase() {
    try {
        // First create the database if it doesn't exist
        await createDatabase();

        // Enable UUID extension
        await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

        // Create users table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        full_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone_number TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Create indexes
        await pool.query('CREATE INDEX IF NOT EXISTS users_email_idx ON users(email)');
        await pool.query('CREATE INDEX IF NOT EXISTS users_phone_number_idx ON users(phone_number)');

        console.log('Database setup completed successfully');
    } catch (error) {
        console.error('Error setting up database:', error);
        throw error;
    } finally {
        await pool.end();
    }
} 