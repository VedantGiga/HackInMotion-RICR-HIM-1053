import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getAuthenticatedUserId } from "@/lib/auth-helper";

export async function POST(req: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return errorResponse("Message string is required", 400);
    }

    // 1. Fetch user's financial context from DB
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: "desc" },
    });

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals: Record<string, number> = {};

    transactions.forEach((tx) => {
      const amt = Math.abs(tx.amount);
      const isIncome = tx.category?.type === "income" || tx.category?.name === "Income";
      if (isIncome) {
        totalIncome += amt;
      } else {
        totalExpense += amt;
        const catName = tx.category?.name || "General Expense";
        categoryTotals[catName] = (categoryTotals[catName] || 0) + amt;
      }
    });

    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;
    const [userObj, budgets, goals] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { healthScore: true } }),
      prisma.budget.findMany({ where: { userId }, include: { category: true } }),
      prisma.goal.findMany({ where: { userId } }),
    ]);

    const healthScore = userObj?.healthScore ?? 100;

    const topCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([cat, amt]) => `${cat}: $${amt.toFixed(2)}`)
      .join(", ");

    const activeGoalsSummary = goals.length > 0
      ? goals.map(g => `${g.name}: $${g.currentAmount.toFixed(0)}/$${g.targetAmount.toFixed(0)} (${Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100))}%)`).join("; ")
      : "None set yet";

    const activeBudgetsSummary = budgets.length > 0
      ? budgets.map(b => `${b.category.name}: Limit $${b.limit.toFixed(0)}`).join("; ")
      : "None set yet";

    const apiKey = process.env.GEMINI_API_KEY;

    // 2. Call Google Gemini API if API key is provided
    if (apiKey && apiKey.trim().length > 0) {
      const systemPrompt = `You are Koshin AI, a world-class financial co-pilot and advisor. 
Provide concise, non-jargon, and empowering advice based strictly on the user's real financial data:
- Financial Health Score: ${healthScore}/100
- Monthly Income: $${totalIncome.toFixed(2)}
- Total Expenses: $${totalExpense.toFixed(2)}
- Net Savings: $${netSavings.toFixed(2)} (Savings Rate: ${savingsRate}%)
- Top Spending Categories: ${topCategories || "None yet"}
- Active Savings Goals: ${activeGoalsSummary}
- Active Category Budgets: ${activeBudgetsSummary}
- Total Transactions Tracked: ${transactions.length}

Answer the user's question directly. Keep response under 4 sentences unless detailed calculations are asked. Be encouraging and actionable.`;

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    { text: `${systemPrompt}\n\nUser Question: ${message}` }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 300,
              }
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            return successResponse({ reply: candidateText, isGemini: true }, "Gemini response generated");
          }
        }
      } catch (err) {
        console.warn("Gemini API call failed, falling back to rule engine:", err);
      }
    }

    // 3. Fallback Smart Rule Engine (Grounded in real user data)
    let fallbackReply = `Based on your statement data: your total monthly expenses are $${totalExpense.toFixed(2)} with a savings rate of ${savingsRate}%. `;
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes("spend") || lowerMsg.includes("most") || lowerMsg.includes("top")) {
      fallbackReply += topCategories 
        ? `Your top spending categories are ${topCategories}. Cutting your highest category by 15% would add +$${((Object.values(categoryTotals)[0] || 0) * 0.15).toFixed(2)}/mo to your savings.`
        : `Upload a bank statement to track your top category spending!`;
    } else if (lowerMsg.includes("save") || lowerMsg.includes("cut")) {
      fallbackReply += `If you reduce food and subscriptions by 20%, you will save +$${(totalExpense * 0.15).toFixed(2)} each month, growing to +$${((totalExpense * 0.15) * 12 * 5.86).toFixed(0)} over 5 years with interest!`;
    } else {
      fallbackReply += `Your Financial Health Score is ${healthScore}/100 based on ${transactions.length} line items. Ask me anything about your subscriptions, budget limits, or savings targets!`;
    }

    return successResponse({ reply: fallbackReply, isGemini: false }, "Fallback response generated");

  } catch (error: any) {
    console.error("POST ai/chat error:", error);
    return errorResponse("Internal server error", 500);
  }
}
