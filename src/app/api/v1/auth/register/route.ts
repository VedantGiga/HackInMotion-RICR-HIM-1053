import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, phone } = body;

    if (!email || typeof email !== "string" || !email.trim()) {
      return errorResponse("Valid email address is required", 400);
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return errorResponse("Password must be at least 6 characters long", 400);
    }

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return errorResponse("User already exists with this email address", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        name: name ? String(name).trim() : null,
        phone: phone ? String(phone).trim() : null,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      }
    });

    return successResponse(user, "User registered successfully", 201);
  } catch (error: any) {
    console.error("[Register Error]:", error);
    return errorResponse(error?.message || "Internal server error during registration", 500);
  }
}

