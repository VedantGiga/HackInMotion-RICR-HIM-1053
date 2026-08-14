import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getAuthenticatedUserId } from "@/lib/auth-helper";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getAuthenticatedUserId();
    const resolvedParams = await params;
    const transactionId = resolvedParams.id;
    const body = await req.json();

    const existingTransaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!existingTransaction || existingTransaction.userId !== userId) {
      return errorResponse("Transaction not found or unauthorized", 404);
    }

    let { amount, date, description, categoryId, categoryName, isRecurring } = body;

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

    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        amount: amount ? Math.abs(parseFloat(amount)) : undefined,
        date: date ? new Date(date) : undefined,
        description,
        merchant: description,
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
    const userId = await getAuthenticatedUserId();
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
