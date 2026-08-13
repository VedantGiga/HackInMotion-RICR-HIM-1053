import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return errorResponse("Unauthorized", 401);
    }

    const userId = (session.user as any).id;

    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    const goalsWithProgress = goals.map(goal => ({
      ...goal,
      progressPercentage: Math.min((goal.currentAmount / goal.targetAmount) * 100, 100),
      isCompleted: goal.currentAmount >= goal.targetAmount
    }));

    return successResponse(goalsWithProgress, "Goals retrieved successfully");
  } catch (error: any) {
    console.error("GET goals error:", error);
    return errorResponse("Internal server error", 500);
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return errorResponse("Unauthorized", 401);
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { name, targetAmount, currentAmount, deadline } = body;

    if (!name || !targetAmount) {
      return errorResponse("Name and targetAmount are required", 400);
    }

    const goal = await prisma.goal.create({
      data: {
        userId,
        name,
        targetAmount: parseFloat(targetAmount),
        currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    return successResponse(goal, "Goal created successfully", 201);
  } catch (error: any) {
    console.error("POST goal error:", error);
    return errorResponse("Internal server error", 500);
  }
}
