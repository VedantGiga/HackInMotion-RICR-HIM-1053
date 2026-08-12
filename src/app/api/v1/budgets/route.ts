import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { errorResponse, successResponse } from "@/lib/api-response";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return errorResponse("Unauthorized", 401);
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(req.url);
    const monthStr = searchParams.get("month");
    const yearStr = searchParams.get("year");

    const month = monthStr ? parseInt(monthStr) : new Date().getMonth() + 1;
    const year = yearStr ? parseInt(yearStr) : new Date().getFullYear();

    const budgets = await prisma.budget.findMany({
      where: {
        userId,
        month,
        year
      },
      include: { category: true }
    });

    // Calculate progress for each budget
    const budgetsWithProgress = await Promise.all(budgets.map(async (budget) => {
      const startOfMonth = new Date(budget.year, budget.month - 1, 1);
      const endOfMonth = new Date(budget.year, budget.month, 0);

      const spent = await prisma.transaction.aggregate({
        where: {
          userId,
          categoryId: budget.categoryId,
          date: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        },
        _sum: { amount: true }
      });

      const totalSpent = Math.abs(spent._sum.amount || 0);

      return {
        ...budget,
        spent: totalSpent,
        progressPercentage: Math.min((totalSpent / budget.limit) * 100, 100),
        isOverBudget: totalSpent > budget.limit
      };
    }));

    return successResponse(budgetsWithProgress, "Budgets retrieved successfully");
  } catch (error: any) {
    console.error("GET budgets error:", error);
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
    const { categoryId, limit, month, year } = body;

    if (!categoryId || !limit || !month || !year) {
      return errorResponse("categoryId, limit, month, and year are required", 400);
    }

    const existingBudget = await prisma.budget.findFirst({
      where: { userId, categoryId, month, year }
    });

    if (existingBudget) {
      return errorResponse("Budget for this category and month already exists", 400);
    }

    const budget = await prisma.budget.create({
      data: {
        userId,
        categoryId,
        limit: parseFloat(limit),
        month: parseInt(month),
        year: parseInt(year),
      },
      include: { category: true }
    });

    return successResponse(budget, "Budget created successfully", 201);
  } catch (error: any) {
    console.error("POST budget error:", error);
    return errorResponse("Internal server error", 500);
  }
}
