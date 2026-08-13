import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, phone } = body;

    if (!email || !password) {
      return errorResponse("Email and password are required", 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return errorResponse("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
      }
    });

    return successResponse(user, "User registered successfully", 201);
  } catch (error: any) {
    console.error("Registration error:", error);
    return errorResponse("Internal server error", 500);
  }
}
