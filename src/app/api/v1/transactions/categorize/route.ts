import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api-response";
import { processUncategorizedTransactions } from "@/modules/categorization";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return errorResponse("Unauthorized", 401);
    }

    const userId = (session.user as any).id;
    
    const count = await processUncategorizedTransactions(userId);

    return successResponse(
      { categorizedCount: count },
      `Successfully categorized ${count} transactions`,
      200
    );
  } catch (error: any) {
    console.error("POST categorize error:", error);
    return errorResponse("Internal server error", 500);
  }
}
