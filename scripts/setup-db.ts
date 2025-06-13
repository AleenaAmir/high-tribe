import { config } from 'dotenv';
import { setupDatabase } from '../src/db/setup';

// Load environment variables
config();

async function main() {
    try {
        await setupDatabase();
        process.exit(0);
    } catch (error) {
        console.error('Failed to setup database:', error);
        process.exit(1);
    }
}

main(); 