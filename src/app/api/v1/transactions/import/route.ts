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

    if (p1 > 12 && p3 > 1000) {
      return new Date(p3, p2 - 1, p1);
    }
    if (p1 > 1000) {
      return new Date(p1, p2 - 1, p3);
    }
    return new Date(p3 > 1000 ? p3 : 2026, p1 - 1, p2);
  }

  return new Date();
}

/**
 * Extracts transactions from raw PDF bank statement text lines
 */
function extractTransactionsFromPdfText(text: string) {
  const lines = text.split(/\r?\n/);
  const extracted: Array<{ date: string; amount: number; description: string }> = [];

  const dateRegex = /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/;
  const amountRegex = /[\$\₹\€\£]?\s*(\d{1,6}(?:\.\d{2})?)/;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.length < 5) continue;

    const dateMatch = line.match(dateRegex);
    const amountMatch = line.match(amountRegex);

    if (dateMatch && amountMatch) {
      const dateStr = dateMatch[1];
      const amountVal = parseFloat(amountMatch[1]);
      if (isNaN(amountVal) || amountVal === 0) continue;

      let description = line
        .replace(dateMatch[0], "")
        .replace(amountMatch[0], "")
        .replace(/[^a-zA-Z0-9\s\*&]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      if (!description || description.length < 2) {
        description = "Bank Transaction";
      }

      extracted.push({
        date: dateStr,
        amount: amountVal,
        description,
      });
    }
  }

  return extracted;
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

    const isPdf = file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";

    // Pre-fetch existing user transactions & DB categories
    const [existingTx, categories] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        select: { amount: true, date: true, description: true },
      }),
      prisma.category.findMany(),
    ]);

    const existingKeys = new Set(
      existingTx.map((t) => `${t.amount}_${t.date.toISOString().split("T")[0]}_${t.description.toLowerCase().trim()}`)
    );

    const categoryMap = new Map<string, string>();
    categories.forEach((c) => categoryMap.set(c.name, c.id));

    let importedCount = 0;
    let duplicateCount = 0;

    if (isPdf) {
      // PDF Bank Statement Parsing
      let pdfText = "";
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const pdfParse: any = await import("pdf-parse");
        const parseFn = pdfParse.default || pdfParse;
        const parsedPdf = await parseFn(buffer);
        pdfText = parsedPdf.text || "";
      } catch (err) {
        console.warn("PDF-parse fallback to buffer string:", err);
        pdfText = await file.text();
      }

      const rows = extractTransactionsFromPdfText(pdfText);

      // If PDF text extraction returned structured rows
      for (const row of rows) {
        const date = parseRobustDate(row.date);
        const dateKey = date.toISOString().split("T")[0];
        const dedupeKey = `${row.amount}_${dateKey}_${row.description.toLowerCase().trim()}`;

        if (existingKeys.has(dedupeKey)) {
          duplicateCount++;
          continue;
        }

        const catRes = await categorizeTransactionDetailed(row.description);
        let categoryId = categoryMap.get(catRes.category);
        if (!categoryId) {
          const newCat = await prisma.category.create({
            data: { name: catRes.category, type: "expense" },
          });
          categoryId = newCat.id;
          categoryMap.set(catRes.category, categoryId);
        }

        await prisma.transaction.create({
          data: {
            userId,
            amount: Math.abs(row.amount),
            date,
            description: row.description,
            merchant: catRes.cleanMerchant,
            confidence: catRes.confidence,
            isRecurring: catRes.isRecurring,
            categoryId,
          },
        });

        existingKeys.add(dedupeKey);
        importedCount++;
      }

      return successResponse(
        { imported: importedCount, duplicatesSkipped: duplicateCount },
        `Successfully extracted and imported ${importedCount} transactions from PDF bank statement`,
        201
      );
    }

    // CSV Bank Statement Parsing
    const text = await file.text();

    return new Promise<NextResponse>((resolve) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const data = results.data as any[];

            for (const row of data) {
              const dateStr = row.Date || row.date || row.DatePosted || row.TxnDate || row.TransactionDate;
              const amountStr = row.Amount || row.amount || row.Value || row.TxnAmount;
              const description = row.Description || row.description || row.Name || row.Memo || row.Payee || row.Merchant;

              if (!description || !amountStr) continue;

              const amount = parseFloat(amountStr);
              if (isNaN(amount)) continue;

              const date = parseRobustDate(dateStr);
              const dateKey = date.toISOString().split("T")[0];
              const dedupeKey = `${amount}_${dateKey}_${description.toLowerCase().trim()}`;

              if (existingKeys.has(dedupeKey)) {
                duplicateCount++;
                continue;
              }

              const catRes = await categorizeTransactionDetailed(description);
              let categoryId = categoryMap.get(catRes.category);
              if (!categoryId) {
                const newCat = await prisma.category.create({
                  data: { name: catRes.category, type: amount < 0 ? "expense" : "income" },
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
                },
              });

              existingKeys.add(dedupeKey);
              importedCount++;
            }

            resolve(
              successResponse(
                { imported: importedCount, duplicatesSkipped: duplicateCount },
                `Successfully imported ${importedCount} transactions from CSV (${duplicateCount} duplicates skipped)`,
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
