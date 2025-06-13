import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/jwt';
import { z } from 'zod';

// Login validation schema
const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export async function POST(req: Request) {
    try {
        console.log('Received login request');
        const body = await req.json();
        console.log('Request body:', body);

        // Validate request body
        const validatedData = loginSchema.parse(body);
        console.log('Validated data:', validatedData);

        // Find user by email
        console.log('Finding user...');
        const [user] = await db.select().from(users).where(eq(users.email, validatedData.email));

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Verify password
        console.log('Verifying password...');
        const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
        });

        return NextResponse.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber
            },
            access_token: token
        });
    } catch (error: any) {
        console.error('Login error:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Validation error', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
} 