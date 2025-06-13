import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { signupSchema } from '@/lib/validations/auth';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { generateToken } from '@/lib/jwt';

export async function POST(req: Request) {
    try {
        console.log('Received signup request');
        const body = await req.json();
        console.log('Request body:', body);

        // Validate request body
        const validatedData = signupSchema.parse(body);
        console.log('Validated data:', validatedData);

        // Check if user already exists
        console.log('Checking for existing user...');
        const existingUsers = await db.select().from(users).where(eq(users.email, validatedData.email));
        console.log('Existing users check result:', existingUsers);

        if (existingUsers.length > 0) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);
        console.log('Password hashed successfully');

        // Create new user
        console.log('Creating new user...');
        const [newUser] = await db.insert(users).values({
            fullName: validatedData.fullName,
            email: validatedData.email,
            phoneNumber: validatedData.phoneNumber,
            password: hashedPassword,
        }).returning();
        console.log('New user created:', { id: newUser.id, email: newUser.email });

        // Generate JWT token
        const token = generateToken({
            userId: newUser.id,
            email: newUser.email,
        });

        return NextResponse.json(
            {
                message: 'User registered successfully',
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    fullName: newUser.fullName,
                    phoneNumber: newUser.phoneNumber
                },
                access_token: token
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Detailed error:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            cause: error.cause
        });

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Validation error', details: error.errors },
                { status: 400 }
            );
        }

        // Check for database connection errors
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            console.error('Database connection failed:', error);
            return NextResponse.json(
                { error: 'Database connection error. Please try again later.' },
                { status: 500 }
            );
        }

        // Check for duplicate key errors
        if (error.code === '23505') {
            return NextResponse.json(
                { error: 'User with this email or phone number already exists' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
} 