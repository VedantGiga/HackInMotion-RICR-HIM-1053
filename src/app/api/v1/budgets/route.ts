import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api-response";

import { getAuthenticatedUserId } from "@/lib/auth-helper";

export async function GET(req: Request) {
  try {
    const userId = await getAuthenticatedUserId();
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
      const endOfMonth = new Date(budget.year, budget.month, 0, 23, 59, 59);

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
    const userId = await getAuthenticatedUserId();
    const body = await req.json();
    let { categoryId, categoryName, limit, month, year } = body;

    if (!limit) {
      return errorResponse("Budget limit is required", 400);
    }

    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();

    if (!categoryId && categoryName) {
      let category = await prisma.category.findUnique({
        where: { name: categoryName }
      });
      if (!category) {
        category = await prisma.category.create({
          data: { name: categoryName, type: "expense" }
        });
      }
      categoryId = category.id;
    }

    if (!categoryId) {
      return errorResponse("categoryId or categoryName is required", 400);
    }

    const budget = await prisma.budget.upsert({
      where: {
        userId_categoryId_month_year: {
          userId,
          categoryId,
          month: currentMonth,
          year: currentYear
        }
      },
      update: {
        limit: parseFloat(limit)
      },
      create: {
        userId,
        categoryId,
        limit: parseFloat(limit),
        month: currentMonth,
        year: currentYear
      },
      include: { category: true }
    });

    return successResponse(budget, "Budget saved successfully", 201);
  } catch (error: any) {
    console.error("POST budget error:", error);
    return errorResponse("Internal server error", 500);
  }
}
