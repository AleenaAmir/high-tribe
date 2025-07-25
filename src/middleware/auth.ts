import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function authMiddleware(request: NextRequest) {
    try {
        // const authHeader = request.headers.get('authorization');

        // if (!authHeader || !authHeader.startsWith('Bearer ')) {
        //     return NextResponse.json(
        //         { error: 'Unauthorized - No token provided' },
        //         { status: 401 }
        //     );
        // }

        // const token = authHeader.split(' ')[1];
        // const payload = verifyToken(token);

        // Add user info to request headers for use in the route handler
        // const requestHeaders = new Headers(request.headers);
        // requestHeaders.set('x-user-id', payload.userId);
        // requestHeaders.set('x-user-email', payload.email);

        // return NextResponse.next({
        //     request: {
        //         headers: requestHeaders,
        //     },
        // });
    } catch (error) {
        return NextResponse.json(
            { error: 'Unauthorized - Invalid token' },
            { status: 401 }
        );
    }
} 