import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { signupSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";
import { sql } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    console.log("Received signup request");
    const body = await req.json();
    console.log("Request body:", body);

    // Validate request body
    const validatedData = signupSchema.parse(body);
    console.log("Validated data:", validatedData);

    // Check if user already exists using raw SQL first
    console.log("Checking for existing user...");
    try {
      const existingUser = await db.execute(sql`
                SELECT id, email 
                FROM users 
                WHERE email = ${validatedData.email}
                LIMIT 1
            `);
      console.log("Existing user check result:", existingUser);

      if (existingUser.length > 0) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        );
      }
    } catch (queryError: any) {
      console.error("Error checking existing user:", {
        message: queryError.message,
        code: queryError.code,
        stack: queryError.stack,
      });
      throw queryError;
    }

    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    console.log("Password hashed successfully");

    // Create new user
    console.log("Creating new user...");
    try {
      const [newUser] = await db
        .insert(users)
        .values({
          fullName: validatedData.fullName,
          email: validatedData.email,
          phoneNumber: validatedData.phoneNumber,
          password: hashedPassword,
          agreeToTerms: validatedData.agreeToTerms,
        })
        .returning();
      console.log("New user created:", {
        id: newUser.id,
        email: newUser.email,
      });

      // Generate JWT token
      const token = generateToken({
        userId: newUser.id,
        email: newUser.email,
      });

      const response = NextResponse.json(
        {
          message: "User registered successfully",
          token: token, // Add token to response body for localStorage
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.fullName, // Add name field for consistency
            fullName: newUser.fullName,
            phoneNumber: newUser.phoneNumber,
          },
        },
        { status: 200 }
      );

      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return response;
    } catch (insertError: any) {
      console.error("Error creating new user:", {
        message: insertError.message,
        code: insertError.code,
        stack: insertError.stack,
        details: insertError.detail,
      });
      throw insertError;
    }
  } catch (error: any) {
    console.error("Detailed error:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause,
      code: error.code,
      detail: error.detail,
    });

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    // Check for database connection errors
    if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
      console.error("Database connection failed:", error);
      return NextResponse.json(
        { error: "Database connection error. Please try again later." },
        { status: 500 }
      );
    }

    // Check for duplicate key errors
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "User with this email or phone number already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
