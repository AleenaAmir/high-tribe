import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';

export async function GET() {
    try {
        console.log('Testing database connection...');

        // Try to query the users table
        const result = await db.select().from(users).limit(1);
        console.log('Database query successful:', result);

        return NextResponse.json({
            status: 'success',
            message: 'Database connection successful',
            result
        });
    } catch (error: any) {
        console.error('Database connection test failed:', {
            name: error.name,
            message: error.message,
            code: error.code,
            stack: error.stack
        });

        return NextResponse.json({
            status: 'error',
            message: 'Database connection failed',
            error: {
                name: error.name,
                message: error.message,
                code: error.code
            }
        }, { status: 500 });
    }
} 