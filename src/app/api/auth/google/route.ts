import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateToken } from "@/lib/jwt";
import { z } from "zod";
import { OAuth2Client } from "google-auth-library";

// Google OAuth validation schema
const googleAuthSchema = z.object({
  credential: z.string().min(1, "Google credential is required"),
  phoneNumber: z.string().optional(), // Optional for new users
});

// Initialize Google OAuth client
const googleClient = new OAuth2Client(
  "814963512618-7fmmpki2f7lk0j4jqnsk2ga3am3hi12o.apps.googleusercontent.com"
);

export async function POST(req: Request) {
  try {
    console.log("Received Google OAuth request");
    const body = await req.json();
    console.log("Request body:", body);

    // Validate request body
    const validatedData = googleAuthSchema.parse(body);
    console.log("Validated data:", validatedData);

    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: validatedData.credential,
      audience: "814963512618-7fmmpki2f7lk0j4jqnsk2ga3am3hi12o.apps.googleusercontent.com"
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid Google token" },
        { status: 401 }
      );
    }

    const googleUser = {
      email: payload.email!,
      name: payload.name!,
      picture: payload.picture!,
      sub: payload.sub!
    };

    console.log("Verified Google user:", googleUser);

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, googleUser.email));

    let user;
    let isNewUser = false;

    if (existingUser) {
      // User exists, use existing user
      user = existingUser;
      console.log("Existing user found:", user.email);
    } else {
      // New user - check if phone number is provided
      if (!validatedData.phoneNumber) {
        // Return user data without creating account, requesting phone number
        return NextResponse.json({
          message: "Phone number required for new user",
          requiresPhoneNumber: true,
          user: {
            email: googleUser.email,
            fullName: googleUser.name,
            picture: googleUser.picture,
          },
        }, { status: 200 });
      }

      // Create new user with provided phone number
      const [newUser] = await db
        .insert(users)
        .values({
          fullName: googleUser.name,
          email: googleUser.email,
          phoneNumber: validatedData.phoneNumber,
          password: "google-oauth-user", // Placeholder password for OAuth users
          agreeToTerms: true,
        })
        .returning();

      user = newUser;
      isNewUser = true;
      console.log("New Google OAuth user created:", user.email);
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    const response = NextResponse.json({
      message: "Google OAuth login successful",
      isNewUser,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        picture: googleUser.picture, // Include Google profile picture
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error: any) {
    console.error("Google OAuth error:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
} 