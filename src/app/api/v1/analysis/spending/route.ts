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

    // Get current date boundaries
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Group expenses by category for this month
    const thisMonthExpenses = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        date: { gte: startOfThisMonth },
        amount: { lt: 0 }, // Expenses only (assuming negative amount for expenses, or you can filter by category type)
      },
      _sum: { amount: true },
    });

    // We assumed expenses are positive numbers above, let's just aggregate everything and use Category type
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: startOfLastMonth },
      },
      include: { category: true }
    });

    // Process trends in JS since SQLite groupBy with joins is limited in Prisma
    let totalSpentThisMonth = 0;
    let totalSpentLastMonth = 0;
    const categorySpendingThisMonth: Record<string, number> = {};
    const categorySpendingLastMonth: Record<string, number> = {};

    for (const tx of transactions) {
      if (tx.category?.type === "income") continue; // Skip income

      const isThisMonth = tx.date >= startOfThisMonth;
      const categoryName = tx.category?.name || "Uncategorized";
      const amt = Math.abs(tx.amount); // Treat all expenses as absolute positive

      if (isThisMonth) {
        totalSpentThisMonth += amt;
        categorySpendingThisMonth[categoryName] = (categorySpendingThisMonth[categoryName] || 0) + amt;
      } else {
        totalSpentLastMonth += amt;
        categorySpendingLastMonth[categoryName] = (categorySpendingLastMonth[categoryName] || 0) + amt;
      }
    }

    // Identify recurring transactions (simple naive approach)
    // Find transactions grouped by amount and description with count > 1
    const potentialRecurring = await prisma.transaction.groupBy({
      by: ['amount', 'description'],
      where: { userId },
      _count: { id: true },
      having: {
        id: { _count: { gt: 1 } }
      }
    });

    return successResponse({
      totalSpentThisMonth,
      totalSpentLastMonth,
      monthOverMonthChange: totalSpentLastMonth === 0 ? 0 : ((totalSpentThisMonth - totalSpentLastMonth) / totalSpentLastMonth) * 100,
      breakdownThisMonth: Object.entries(categorySpendingThisMonth).map(([name, amount]) => ({ name, amount })),
      breakdownLastMonth: Object.entries(categorySpendingLastMonth).map(([name, amount]) => ({ name, amount })),
      potentialRecurring: potentialRecurring.filter(r => r._count.id > 1)
    }, "Spending analysis retrieved");
  } catch (error: any) {
    console.error("GET spending analysis error:", error);
    return errorResponse("Internal server error", 500);
  }
}
