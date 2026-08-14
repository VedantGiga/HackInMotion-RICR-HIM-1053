import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getAuthenticatedUserId } from "@/lib/auth-helper";
import { categorizeTransactionDetailed } from "@/modules/categorization";
import { getTransactionsStore, saveTransactionsStore, deleteTransactionStore, StoredTransaction } from "@/lib/transaction-store";
import { saveUserTransactionFirestore, getUserTransactionsFirestore } from "@/lib/firebase/db";

export async function GET(req: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    let dbTxns: any[] = [];

    try {
      dbTxns = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        include: { category: true }
      });
    } catch (dbErr) {
      console.warn("[GET transactions DB warning]:", dbErr);
    }

    const storeTxns = getTransactionsStore(userId);

    // Merge transactions by ID
    const mergedMap = new Map<string, any>();
    
    // Add store transactions first
    storeTxns.forEach(t => {
      mergedMap.set(t.id, {
        id: t.id,
        amount: t.amount,
        date: t.date,
        description: t.description,
        merchant: t.merchant || t.description,
        confidence: t.confidence || 0.95,
        isRecurring: t.isRecurring || false,
        category: t.category || { name: t.categoryName || "General Expense", type: t.type || "expense" },
        account: t.account || "Main Bank",
      });
    });

    // Add DB transactions
    dbTxns.forEach(t => {
      if (!mergedMap.has(t.id)) {
        mergedMap.set(t.id, t);
      }
    });

    const finalTxns = Array.from(mergedMap.values());

    return successResponse(finalTxns, "Transactions retrieved successfully");
  } catch (error: any) {
    console.error("GET transactions error:", error);
    return errorResponse("Internal server error", 500);
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    const body = await req.json();
    const { amount, date, description, categoryName, isRecurring, merchant, account } = body;

    if (!amount || !description) {
      return errorResponse("Amount and description are required", 400);
    }

    const catRes = await categorizeTransactionDetailed(description);
    const targetCategory = categoryName || catRes.category;
    const isIncome = targetCategory.toLowerCase() === "income" || parseFloat(amount) < 0 || body.type === "income";
    const dateStr = date ? new Date(date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];

    const newStoredTx: StoredTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      userId,
      amount: Math.abs(parseFloat(amount)),
      date: dateStr,
      description,
      merchant: merchant || catRes.cleanMerchant || description,
      categoryName: targetCategory,
      category: { name: targetCategory, type: isIncome ? "income" : "expense" },
      confidence: catRes.confidence,
      isRecurring: isRecurring !== undefined ? isRecurring : catRes.isRecurring,
      type: isIncome ? "income" : "expense",
      account: account || "Main Bank",
      createdAt: new Date().toISOString(),
    };

    // Save in store
    saveTransactionsStore(userId, [newStoredTx]);

    // Save in Firestore
    try {
      await saveUserTransactionFirestore(userId, {
        amount: newStoredTx.amount,
        date: newStoredTx.date,
        description: newStoredTx.description,
        merchant: newStoredTx.merchant,
        category: targetCategory,
        type: newStoredTx.type,
        isRecurring: newStoredTx.isRecurring,
      });
    } catch (fsErr) {
      console.warn("[Firestore Single Tx Save Warning]:", fsErr);
    }

    // Save in Prisma if available
    try {
      try {
        const userExists = await prisma.user.findUnique({ where: { id: userId } });
        if (!userExists) {
          await prisma.user.create({
            data: {
              id: userId,
              email: `${userId}@firebase.internal`,
              password: "firebase_user_placeholder",
              name: "User",
            },
          });
        }
      } catch (uErr) {
        // Ignore shadow user creation warning
      }

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

      await prisma.transaction.create({
        data: {
          id: newStoredTx.id,
          userId,
          amount: newStoredTx.amount,
          date: new Date(newStoredTx.date),
          description,
          merchant: newStoredTx.merchant,
          confidence: newStoredTx.confidence,
          isRecurring: newStoredTx.isRecurring,
          categoryId: category.id,
        },
      });
    } catch (dbErr) {
      console.warn("[Prisma POST tx warning]:", dbErr);
    }

    return successResponse(newStoredTx, "Transaction created successfully", 201);
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

    deleteTransactionStore(userId, id || undefined);

    try {
      if (id) {
        await prisma.transaction.deleteMany({
          where: { id, userId }
        });
      } else {
        await prisma.transaction.deleteMany({
          where: { userId }
        });
      }
    } catch (dbErr) {
      console.warn("[Prisma DELETE tx warning]:", dbErr);
    }

    return successResponse({ deletedId: id || "all" }, "Transaction(s) deleted successfully");
  } catch (error: any) {
    console.error("DELETE transaction error:", error);
    return errorResponse("Internal server error", 500);
  }
}
