import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getAuthenticatedUserId } from "@/lib/auth-helper";

export async function GET(req: Request) {
  try {
    const userId = await getAuthenticatedUserId();

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: 'desc' }
    });

    let totalSpent = 0;
    let totalIncome = 0;
    const categorySpending: Record<string, number> = {};

    for (const tx of transactions) {
      const isIncome = tx.category?.type === "income" || tx.category?.name === "Income";
      const amt = Math.abs(tx.amount);

      if (isIncome) {
        totalIncome += amt;
      } else {
        totalSpent += amt;
        const categoryName = tx.category?.name || "General Expense";
        categorySpending[categoryName] = (categorySpending[categoryName] || 0) + amt;
      }
    }

    const recurringTx = transactions.filter(t => t.isRecurring);

    return successResponse({
      totalSpentThisMonth: totalSpent,
      totalIncomeThisMonth: totalIncome,
      netSavings: totalIncome - totalSpent,
      breakdownThisMonth: Object.entries(categorySpending).map(([name, amount]) => ({ name, amount })),
      potentialRecurring: recurringTx
    }, "Spending analysis retrieved");
  } catch (error: any) {
    console.error("GET spending analysis error:", error);
    return errorResponse("Internal server error", 500);
  }
}
