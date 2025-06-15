import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
    try {
        // Test database connection
        await db.execute(sql`SELECT 1`);
        console.log('Database connection successful');

        // Check if users table exists and has correct structure
        const tableInfo = await db.execute(sql`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'users'
            ORDER BY ordinal_position;
        `);
        console.log('Users table structure:', tableInfo);

        // Try to count users
        const userCount = await db.select({ count: sql<number>`count(*)` }).from(users);
        console.log('Total users:', userCount[0].count);

        return NextResponse.json({
            status: 'success',
            message: 'Database connection and table structure verified',
            tableInfo,
            userCount: userCount[0].count
        });
    } catch (error: any) {
        console.error('Database test failed:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });

        return NextResponse.json({
            status: 'error',
            message: 'Database test failed',
            error: error.message,
            code: error.code
        }, { status: 500 });
    }
} 