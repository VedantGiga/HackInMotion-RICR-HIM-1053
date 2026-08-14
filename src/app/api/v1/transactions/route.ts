import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getAuthenticatedUserId } from "@/lib/auth-helper";
import { categorizeTransactionDetailed } from "@/modules/categorization";

export async function GET(req: Request) {
  try {
    const userId = await getAuthenticatedUserId();

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

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
    const userId = await getAuthenticatedUserId();
    const body = await req.json();
    const { amount, date, description, categoryName, isRecurring, merchant } = body;

    if (!amount || !description) {
      return errorResponse("Amount and description are required", 400);
    }

    const catRes = await categorizeTransactionDetailed(description);
    const targetCategory = categoryName || catRes.category;

    const isIncome = targetCategory.toLowerCase() === "income" || parseFloat(amount) < 0 || body.type === "income";

    let category = await prisma.category.findUnique({
      where: { name: targetCategory }
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: targetCategory,
          type: isIncome ? "income" : "expense"
        }
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        amount: Math.abs(parseFloat(amount)),
        date: date ? new Date(date) : new Date(),
        description,
        merchant: merchant || catRes.cleanMerchant,
        confidence: catRes.confidence,
        isRecurring: isRecurring !== undefined ? isRecurring : catRes.isRecurring,
        categoryId: category.id,
      },
      include: { category: true }
    });

    return successResponse(transaction, "Transaction created successfully", 201);
  } catch (error: any) {
    console.error("POST transaction error:", error);
    return errorResponse("Internal server error", 500);
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      await prisma.transaction.deleteMany({
        where: { id, userId }
      });
      return successResponse({ deletedId: id }, "Transaction deleted successfully");
    } else {
      // Clear all transactions for user
      await prisma.transaction.deleteMany({
        where: { userId }
      });
      return successResponse({}, "All transactions cleared successfully");
    }
  } catch (error: any) {
    console.error("DELETE transaction error:", error);
    return errorResponse("Internal server error", 500);
  }
}
