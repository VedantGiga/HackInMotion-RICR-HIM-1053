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

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    const userId = (session.user as any).id;

    const where: any = { userId };
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      include: { category: true }
    });

    return successResponse(transactions, "Transactions retrieved successfully");
  } catch (error: any) {
    console.error("GET transactions error:", error);
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
    const { amount, date, description, categoryId, isRecurring } = body;

    if (!amount || !date || !description) {
      return errorResponse("Amount, date, and description are required", 400);
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        amount: parseFloat(amount),
        date: new Date(date),
        description,
        categoryId: categoryId || null,
        isRecurring: isRecurring || false,
      },
      include: { category: true }
    });

    return successResponse(transaction, "Transaction created successfully", 201);
  } catch (error: any) {
    console.error("POST transaction error:", error);
    return errorResponse("Internal server error", 500);
  }
}
