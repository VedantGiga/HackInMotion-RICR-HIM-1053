import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getAuthenticatedUserId } from "@/lib/auth-helper";

export async function GET(req: Request) {
  try {
    const userId = await getAuthenticatedUserId();

    // Fetch all user transactions
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: 'desc' }
    });

    let income = 0;
    let expense = 0;
    const expenseByCategory: Record<string, number> = {};

    transactions.forEach((tx: any) => {
      const amt = Math.abs(tx.amount);
      const isIncomeCategory = tx.category?.type === "income" || tx.category?.name === "Income";
      if (isIncomeCategory) {
        income += amt;
      } else {
        expense += amt;
        const catName = tx.category?.name || "General Expense";
        expenseByCategory[catName] = (expenseByCategory[catName] || 0) + amt;
      }
    });

    let score = 100;
    const insights: string[] = [];
    const savings = income - expense;

    if (transactions.length === 0) {
      score = 0;
      insights.push("You have no recorded transactions yet. Upload a bank statement or scan a receipt to unlock insights!");
    } else {
      if (income > 0) {
        const savingsRate = savings / income;
        if (savingsRate < 0.1) {
          score -= 20;
          insights.push("Your savings rate is under 10%. Try cutting back on non-essential spending.");
        } else if (savingsRate >= 0.2) {
          insights.push("Great job! You are saving over 20% of your total income.");
        }
      } else {
        score -= 25;
        insights.push("No income recorded yet. Make sure to log salary or deposits.");
      }

      const topCategory = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0];
      if (topCategory) {
        insights.push(`Your highest spending category is ${topCategory[0]} ($${topCategory[1].toFixed(2)}).`);
        if (income > 0 && topCategory[1] > (income * 0.4)) {
          score -= 15;
          insights.push(`Warning: ${topCategory[0]} accounts for over 40% of your income.`);
        }
      }
    }

    const finalScore = Math.max(0, Math.min(100, score));

    await prisma.user.update({
      where: { id: userId },
      data: { healthScore: finalScore }
    }).catch(() => null);

    return successResponse({
      score: finalScore,
      insights,
      metrics: {
        income,
        expense,
        savings
      }
    }, "Health score generated successfully");
  } catch (error: any) {
    console.error("GET health analysis error:", error);
    return errorResponse("Internal server error", 500);
  }
}
