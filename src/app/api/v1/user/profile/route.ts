import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return errorResponse("Unauthorized", 401);
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { phone } = body;

    // Validate if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    // Protect existing phone number from being overwritten
    if (phone !== undefined && user.phone) {
      return errorResponse("Phone number cannot be changed once set", 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        ...(phone && { phone }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
      }
    });

    return successResponse(updatedUser, "Profile updated successfully", 200);
  } catch (error: any) {
    console.error("Profile update error:", error);
    return errorResponse("Internal server error", 500);
  }
}
