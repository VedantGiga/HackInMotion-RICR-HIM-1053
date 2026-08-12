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
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch this month's transactions
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: startOfThisMonth },
      },
      include: { category: true }
    });

    let income = 0;
    let expense = 0;
    const expenseByCategory: Record<string, number> = {};

    transactions.forEach(tx => {
      const amt = Math.abs(tx.amount);
      if (tx.category?.type === "income") {
        income += amt;
      } else {
        expense += amt;
        const catName = tx.category?.name || "Uncategorized";
        expenseByCategory[catName] = (expenseByCategory[catName] || 0) + amt;
      }
    });

    // Simple Scoring Logic
    let score = 100;
    const insights = [];

    // Savings Rate Insight
    const savings = income - expense;
    if (income > 0) {
      const savingsRate = savings / income;
      if (savingsRate < 0.1) {
        score -= 20;
        insights.push("You are saving less than 10% of your income this month. Try to cut back on non-essential categories.");
      } else if (savingsRate >= 0.2) {
        insights.push("Great job! You are saving at least 20% of your income.");
      }
    } else {
      score -= 30; // No income recorded
      insights.push("You have no recorded income this month, making it hard to build savings.");
    }

    // High expense category insight
    const topCategory = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0];
    if (topCategory) {
      insights.push(`Your highest expense category is ${topCategory[0]} at $${topCategory[1].toFixed(2)}. Consider reviewing these transactions.`);
      if (topCategory[1] > (income * 0.4) && income > 0) {
        score -= 15;
        insights.push(`Warning: ${topCategory[0]} is consuming more than 40% of your income.`);
      }
    }

    // Update user health score in DB
    const finalScore = Math.max(0, Math.min(100, score));
    await prisma.user.update({
      where: { id: userId },
      data: { healthScore: finalScore }
    });

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
