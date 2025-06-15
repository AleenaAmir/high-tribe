import { NextResponse } from 'next/server';
import { db } from '@/db';
import { authMiddleware } from '@/middleware/auth';
import { sql } from 'drizzle-orm';

interface CountResult {
    count: string;
}

export async function GET(request: Request) {
    try {
        // Apply authentication middleware
        const authResponse = await authMiddleware(request as any);
        if (authResponse.status !== 200) {
            return authResponse;
        }

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const sortBy = searchParams.get('sortBy') || 'created_at';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Calculate offset
        const offset = (page - 1) * limit;

        // Build the base query
        let query = sql`
            SELECT 
                id,
                full_name as "fullName",
                email,
                phone_number as "phoneNumber",
                created_at as "createdAt",
                updated_at as "updatedAt"
            FROM users
        `;

        // Add search condition if provided
        if (search) {
            query = sql`${query} 
                WHERE 
                    full_name ILIKE ${`%${search}%`} OR 
                    email ILIKE ${`%${search}%`} OR 
                    phone_number ILIKE ${`%${search}%`}
            `;
        }

        // Add sorting
        query = sql`${query} ORDER BY ${sql.raw(sortBy)} ${sql.raw(sortOrder.toUpperCase())}`;

        // Add pagination
        query = sql`${query} LIMIT ${limit} OFFSET ${offset}`;

        // Execute query
        const allUsers = await db.execute(query);

        // Get total count
        const countQuery = sql`
            SELECT COUNT(*) as count
            FROM users
            ${search ? sql`WHERE 
                full_name ILIKE ${`%${search}%`} OR 
                email ILIKE ${`%${search}%`} OR 
                phone_number ILIKE ${`%${search}%`}
            ` : sql``}
        `;
        const countResult = await db.execute(countQuery);
        const totalCount = Number(countResult[0]?.count || 0);

        return NextResponse.json({
            users: allUsers,
            pagination: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit)
            }
        });
    } catch (error: any) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
} 