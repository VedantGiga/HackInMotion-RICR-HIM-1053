import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { errorResponse, successResponse } from "@/lib/api-response";
import Papa from "papaparse";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return errorResponse("Unauthorized", 401);
    }

    const userId = (session.user as any).id;
    
    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return errorResponse("No file uploaded", 400);
    }

    const text = await file.text();

    return new Promise<NextResponse>((resolve) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const data = results.data as any[];
            let importedCount = 0;

            const transactionsToCreate = [];

            for (const row of data) {
              // Basic fuzzy mapping for bank statements
              const dateStr = row.Date || row.date || row.DatePosted;
              const amountStr = row.Amount || row.amount || row.Value;
              const description = row.Description || row.description || row.Name || row.Memo;

              if (!dateStr || !amountStr || !description) continue;

              const amount = parseFloat(amountStr);
              if (isNaN(amount)) continue;

              transactionsToCreate.push({
                userId,
                amount,
                date: new Date(dateStr),
                description,
              });
            }

            if (transactionsToCreate.length > 0) {
              const created = await prisma.transaction.createMany({
                data: transactionsToCreate,
              });
              importedCount = created.count;
            }

            resolve(
              successResponse(
                { imported: importedCount },
                `Successfully imported ${importedCount} transactions`,
                201
              )
            );
          } catch (err) {
            console.error("Error inserting parsed data:", err);
            resolve(errorResponse("Error processing CSV data", 500));
          }
        },
        error: (error: any) => {
          console.error("PapaParse error:", error);
          resolve(errorResponse("Error parsing CSV file", 400));
        },
      });
    });
  } catch (error: any) {
    console.error("POST import error:", error);
    return errorResponse("Internal server error", 500);
  }
}
