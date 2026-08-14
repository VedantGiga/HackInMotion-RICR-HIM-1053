import { NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getAuthenticatedUserId } from "@/lib/auth-helper";
import Papa from "papaparse";
import { prisma } from "@/lib/prisma";
import { categorizeTransactionDetailed } from "@/modules/categorization";

const MONTH_MAP: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
};

function parseCleanNumber(val: any): number | null {
  if (val === null || val === undefined) return null;
  const str = String(val).replace(/[^0-9\.\-]/g, "").trim();
  if (!str) return null;
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
}

function parseRobustDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const trimmed = dateStr.trim();

  // Try standard JS Date parser
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) return parsed;

  // Handle DD-MMM-YYYY or MMM DD, YYYY
  const textParts = trimmed.toLowerCase().split(/[\s\/\-\.]+/);
  if (textParts.length >= 3) {
    let day = parseInt(textParts[0], 10);
    let monthIndex = MONTH_MAP[textParts[1].substring(0, 3)];
    let year = parseInt(textParts[2], 10);

    if (isNaN(day) && MONTH_MAP[textParts[0].substring(0, 3)] !== undefined) {
      monthIndex = MONTH_MAP[textParts[0].substring(0, 3)];
      day = parseInt(textParts[1], 10);
    }

    if (!isNaN(day) && monthIndex !== undefined && !isNaN(year)) {
      if (year < 100) year += 2000;
      return new Date(year, monthIndex, day);
    }

    const p1 = parseInt(textParts[0], 10);
    const p2 = parseInt(textParts[1], 10);
    const p3 = parseInt(textParts[2], 10);

    if (!isNaN(p1) && !isNaN(p2) && !isNaN(p3)) {
      const fullYear = p3 > 1000 ? p3 : p1 > 1000 ? p1 : 2026;
      if (p1 > 12 && p3 > 1000) {
        return new Date(fullYear, p2 - 1, p1);
      }
      if (p1 > 1000) {
        return new Date(fullYear, p2 - 1, p3);
      }
      return new Date(fullYear, p1 - 1, p2);
    }
  }

  return new Date();
}

/**
 * Normalizes CSV headers/keys for maximum flexibility across bank CSV formats
 */
function findRowValue(row: Record<string, any>, possibleKeys: string[]): any {
  for (const rawKey of Object.keys(row)) {
    const cleanKey = rawKey.toLowerCase().replace(/[^a-z0-9]/g, "");
    for (const target of possibleKeys) {
      if (cleanKey.includes(target)) {
        const val = row[rawKey];
        if (val !== undefined && val !== null && String(val).trim().length > 0) {
          return val;
        }
      }
    }
  }
  return undefined;
}

/**
 * Extracts transactions from raw PDF bank statement text lines
 */
function extractTransactionsFromPdfText(text: string) {
  const lines = text.split(/\r?\n/);
  const extracted: Array<{ date: string; amount: number; description: string; type?: "expense" | "income" }> = [];

  const dateRegex = /(\d{1,2}[\/\-\.](?:[A-Za-z]{3}|\d{1,2})[\/\-\.]\d{2,4})/;
  const amountRegex = /[\$\₹\€\£]?\s*([\+\-]?\d{1,6}(?:\,\d{3})*(?:\.\d{2})?)/;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.length < 5) continue;
    if (/balance|page|statement|account number|opening|closing/i.test(line)) continue;

    const dateMatch = line.match(dateRegex);
    const amountMatch = line.match(amountRegex);

    if (dateMatch && amountMatch) {
      const dateStr = dateMatch[1];
      const amountVal = parseCleanNumber(amountMatch[1]);
      if (!amountVal || amountVal === 0) continue;

      let description = line
        .replace(dateMatch[0], "")
        .replace(amountMatch[0], "")
        .replace(/[^a-zA-Z0-9\s\*&]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      if (!description || description.length < 2) {
        description = "Bank Statement Line Item";
      }

      const isCredit = /credit|cr|deposit|payroll|refund|income/i.test(line);
      const isDebit = /debit|dr|withdrawal|pos|atm|transfer/i.test(line);

      let finalType: "expense" | "income" = "expense";
      if (isCredit) finalType = "income";
      else if (isDebit) finalType = "expense";
      else if (amountVal > 0) finalType = "expense";

      extracted.push({
        date: dateStr,
        amount: Math.abs(amountVal),
        description,
        type: finalType
      });
    }
  }

  return extracted;
}

export async function POST(req: Request) {
  try {
    const userId = await getAuthenticatedUserId();

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
      let pdfText = "";
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const pdfParse: any = await import("pdf-parse");
        const parseFn = pdfParse.default || pdfParse;
        const parsedPdf = await parseFn(buffer);
        pdfText = parsedPdf.text || "";
      } catch (err) {
        console.warn("PDF-parse fallback to buffer text:", err);
        pdfText = await file.text();
      }

      const rows = extractTransactionsFromPdfText(pdfText);

      for (const row of rows) {
        const date = parseRobustDate(row.date);
        const dateKey = date.toISOString().split("T")[0];
        const dedupeKey = `${row.amount}_${dateKey}_${row.description.toLowerCase().trim()}`;

        if (existingKeys.has(dedupeKey)) {
          duplicateCount++;
          continue;
        }

        const catRes = await categorizeTransactionDetailed(row.description);
        const targetCategoryName = row.type === "income" ? "Income" : catRes.category;
        
        let categoryId = categoryMap.get(targetCategoryName);
        if (!categoryId) {
          const newCat = await prisma.category.create({
            data: { name: targetCategoryName, type: row.type || "expense" },
          });
          categoryId = newCat.id;
          categoryMap.set(targetCategoryName, categoryId);
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
              // Flexible column matching for Description
              const description = findRowValue(row, [
                "description", "narration", "particulars", "payee", "merchant",
                "details", "name", "memo", "remarks", "summary", "transaction"
              ]) || Object.values(row).find(v => typeof v === "string" && v.length > 3 && !v.match(/^\d{1,4}[\/\-\.]/));

              if (!description || String(description).trim().length < 2) continue;

              const cleanDesc = String(description).trim();

              // Flexible column matching for Date
              const dateVal = findRowValue(row, [
                "date", "dt", "txndate", "transactiondate", "postingdate", "valuedate", "timestamp", "time"
              ]) || Object.values(row).find(v => typeof v === "string" && v.match(/\d{1,4}[\/\-\.]/));

              const date = parseRobustDate(String(dateVal || ""));

              // Check split Debit / Credit columns vs single Amount
              const debitVal = parseCleanNumber(findRowValue(row, ["debit", "withdrawal", "dr", "out", "paidout"]));
              const creditVal = parseCleanNumber(findRowValue(row, ["credit", "deposit", "cr", "in", "paidin"]));
              const rawAmount = findRowValue(row, ["amount", "amt", "val", "value", "sum", "price", "total"]);
              const singleAmountVal = parseCleanNumber(rawAmount);

              let amount = 0;
              let isIncome = false;

              if (creditVal !== null && creditVal > 0) {
                amount = creditVal;
                isIncome = true;
              } else if (debitVal !== null && debitVal > 0) {
                amount = debitVal;
                isIncome = false;
              } else if (singleAmountVal !== null) {
                const categoryCol = String(findRowValue(row, ["category", "cat", "type"]) || "").toLowerCase();
                if (categoryCol.includes("income") || categoryCol.includes("credit") || singleAmountVal < 0) {
                  isIncome = singleAmountVal < 0 || categoryCol.includes("income");
                  amount = Math.abs(singleAmountVal);
                } else {
                  amount = Math.abs(singleAmountVal);
                  isIncome = false;
                }
              } else {
                // Try scanning numeric values in the row if key names didn't match
                const numericVals = Object.values(row)
                  .map(v => parseCleanNumber(v))
                  .filter((n): n is number => n !== null && n !== 0);

                if (numericVals.length > 0) {
                  amount = Math.abs(numericVals[0]);
                  isIncome = numericVals[0] < 0;
                } else {
                  continue;
                }
              }

              if (amount === 0) continue;

              const dateKey = date.toISOString().split("T")[0];
              const dedupeKey = `${amount}_${dateKey}_${cleanDesc.toLowerCase()}`;

              if (existingKeys.has(dedupeKey)) {
                duplicateCount++;
                continue;
              }

              const catRes = await categorizeTransactionDetailed(cleanDesc);
              const targetCategoryName = isIncome ? "Income" : (findRowValue(row, ["category", "cat"]) || catRes.category);

              let categoryId = categoryMap.get(targetCategoryName);
              if (!categoryId) {
                const newCat = await prisma.category.create({
                  data: { name: targetCategoryName, type: isIncome ? "income" : "expense" },
                });
                categoryId = newCat.id;
                categoryMap.set(targetCategoryName, categoryId);
              }

              await prisma.transaction.create({
                data: {
                  userId,
                  amount: amount,
                  date,
                  description: cleanDesc,
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
                `Successfully imported ${importedCount} transactions from CSV statement (${duplicateCount} duplicates skipped)`,
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
