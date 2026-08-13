import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api-response";
import Papa from "papaparse";
import { prisma } from "@/lib/prisma";
import { categorizeTransactionDetailed } from "@/modules/categorization";

function parseRobustDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const trimmed = dateStr.trim();
  
  // Standard ISO / YYYY-MM-DD
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) return parsed;

  // DD/MM/YYYY or MM/DD/YYYY
  const parts = trimmed.split(/[\/\-\.]/);
  if (parts.length === 3) {
    const p1 = parseInt(parts[0], 10);
    const p2 = parseInt(parts[1], 10);
    const p3 = parseInt(parts[2], 10);

    // DD/MM/YYYY (Indian bank format e.g. 15/08/2026)
    if (p1 > 12 && p3 > 1000) {
      return new Date(p3, p2 - 1, p1);
    }
    // YYYY/MM/DD
    if (p1 > 1000) {
      return new Date(p1, p2 - 1, p3);
    }
    // MM/DD/YYYY default
    return new Date(p3 > 1000 ? p3 : 2026, p1 - 1, p2);
  }

  return new Date();
}

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
            let duplicateCount = 0;

            // Pre-fetch existing user transactions for duplicate checking
            const existingTx = await prisma.transaction.findMany({
              where: { userId },
              select: { amount: true, date: true, description: true }
            });

            const existingKeys = new Set(
              existingTx.map(t => `${t.amount}_${t.date.toISOString().split('T')[0]}_${t.description.toLowerCase().trim()}`)
            );

            // Fetch DB categories for auto-tagging
            const categories = await prisma.category.findMany();
            const categoryMap = new Map<string, string>();
            categories.forEach(c => categoryMap.set(c.name, c.id));

            for (const row of data) {
              const dateStr = row.Date || row.date || row.DatePosted || row.TxnDate;
              const amountStr = row.Amount || row.amount || row.Value || row.TxnAmount;
              const description = row.Description || row.description || row.Name || row.Memo || row.Payee;

              if (!description || !amountStr) continue;

              const amount = parseFloat(amountStr);
              if (isNaN(amount)) continue;

              const date = parseRobustDate(dateStr);
              const dateKey = date.toISOString().split('T')[0];
              const dedupeKey = `${amount}_${dateKey}_${description.toLowerCase().trim()}`;

              if (existingKeys.has(dedupeKey)) {
                duplicateCount++;
                continue;
              }

              // Auto-categorize
              const catRes = await categorizeTransactionDetailed(description);
              let categoryId = categoryMap.get(catRes.category);
              if (!categoryId) {
                const newCat = await prisma.category.create({
                  data: { name: catRes.category, type: amount < 0 ? "expense" : "income" }
                });
                categoryId = newCat.id;
                categoryMap.set(catRes.category, categoryId);
              }

              await prisma.transaction.create({
                data: {
                  userId,
                  amount: Math.abs(amount),
                  date,
                  description,
                  merchant: catRes.cleanMerchant,
                  confidence: catRes.confidence,
                  isRecurring: catRes.isRecurring,
                  categoryId,
                }
              });

              existingKeys.add(dedupeKey);
              importedCount++;
            }

            resolve(
              successResponse(
                { imported: importedCount, duplicatesSkipped: duplicateCount },
                `Successfully imported ${importedCount} transactions (${duplicateCount} duplicates skipped)`,
                201
              )
            );
          } catch (err) {
            console.error("Error inserting parsed CSV data:", err);
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
