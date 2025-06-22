import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // If the user is trying to access login or signup, let them pass
  if (pathname === "/login" || pathname === "/signup") {
    return NextResponse.next();
  }

  // If there's no token and the user is trying to access a protected route
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If there is a token, you might want to verify it
  // For now, if a token exists, we'll let them through to the dashboard
  if (token && pathname.startsWith("/dashboard")) {
    // Here you could add token verification logic if needed
    // For example, using a library like 'jose' or 'jsonwebtoken'
    // If verification fails, redirect to login
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
