import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return errorResponse("Unauthorized", 401);
    }

    const userId = (session.user as any).id;
    const resolvedParams = await params;
    const transactionId = resolvedParams.id;
    const body = await req.json();

    const existingTransaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!existingTransaction || existingTransaction.userId !== userId) {
      return errorResponse("Transaction not found or unauthorized", 404);
    }

    const { amount, date, description, categoryId, isRecurring } = body;

    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        amount: amount ? parseFloat(amount) : undefined,
        date: date ? new Date(date) : undefined,
        description,
        categoryId,
        isRecurring,
      },
      include: { category: true }
    });

    return successResponse(updatedTransaction, "Transaction updated successfully");
  } catch (error: any) {
    console.error("PUT transaction error:", error);
    return errorResponse("Internal server error", 500);
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return errorResponse("Unauthorized", 401);
    }

    const userId = (session.user as any).id;
    const resolvedParams = await params;
    const transactionId = resolvedParams.id;

    const existingTransaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!existingTransaction || existingTransaction.userId !== userId) {
      return errorResponse("Transaction not found or unauthorized", 404);
    }

    await prisma.transaction.delete({
      where: { id: transactionId },
    });

    return successResponse(null, "Transaction deleted successfully");
  } catch (error: any) {
    console.error("DELETE transaction error:", error);
    return errorResponse("Internal server error", 500);
  }
}
