import { NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getAuthenticatedUserId } from "@/lib/auth-helper";
import Papa from "papaparse";
import { prisma } from "@/lib/prisma";
import { categorizeTransactionDetailed } from "@/modules/categorization";
import { saveTransactionsStore, StoredTransaction } from "@/lib/transaction-store";
import { saveUserTransactionFirestore } from "@/lib/firebase/db";

// ... helper functions ...

const MONTH_MAP: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  january: 0, february: 1, march: 2, april: 3, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
};

function parseCleanNumber(val: any): number | null {
  if (val === null || val === undefined) return null;
  let str = String(val).trim();
  if (!str) return null;

  // Handle accounting negative format (123.45)
  let isNegative = false;
  if (str.startsWith("(") && str.endsWith(")")) {
    isNegative = true;
    str = str.substring(1, str.length - 1);
  } else if (str.startsWith("-") || str.endsWith("-")) {
    isNegative = true;
  }

  // Remove currency signs, letters, and extraneous symbols except digits, dots, commas
  str = str.replace(/[^0-9\.,]/g, "").trim();
  if (!str) return null;

  // Handle Indian/European number formatting (e.g. 1.500,00 -> 1500.00)
  if (str.includes(",") && str.includes(".")) {
    if (str.lastIndexOf(",") > str.lastIndexOf(".")) {
      // European: 1.500,50 -> 1500.50
      str = str.replace(/\./g, "").replace(",", ".");
    } else {
      // Standard: 1,500.50 -> 1500.50
      str = str.replace(/,/g, "");
    }
  } else if (str.includes(",")) {
    const parts = str.split(",");
    if (parts.length === 2 && parts[1].length <= 2) {
      str = str.replace(",", ".");
    } else {
      str = str.replace(/,/g, "");
    }
  }

  const num = parseFloat(str);
  if (isNaN(num)) return null;
  return isNegative ? -Math.abs(num) : num;
}

function parseFlexibleDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const trimmed = dateStr.trim();
  if (!trimmed) return new Date();

  // Standard JS Date parse
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) return parsed;

  // Pattern matching for various date formats
  const textParts = trimmed.toLowerCase().split(/[\s\/\-\.]+/);
  if (textParts.length >= 3) {
    let day = parseInt(textParts[0], 10);
    let monthIndex = MONTH_MAP[textParts[1]];
    let year = parseInt(textParts[2], 10);

    if (monthIndex === undefined && MONTH_MAP[textParts[0]] !== undefined) {
      monthIndex = MONTH_MAP[textParts[0]];
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

function findRowValue(row: Record<string, any>, possibleKeys: string[]): any {
  if (!row || typeof row !== "object") return undefined;
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

function extractTransactionsFromText(text: string) {
  const lines = text.split(/\r?\n/);
  const extracted: Array<{ date: string; amount: number; description: string; type: "expense" | "income" }> = [];

  // Match flexible date patterns (e.g. 14/08/2026, 2026-08-14, 14 Aug 2026, Aug 14, 2026)
  const dateRegex = /(\d{1,4}[\/\-\.](?:[A-Za-z]{3,9}|\d{1,2})[\/\-\.]\d{1,4})|((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{2,4})|(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})/i;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.length < 5) continue;
    if (/balance|page|statement|account number|opening|closing|total|summary|period|customer|branch/i.test(line)) continue;

    const dateMatch = line.match(dateRegex);
    if (!dateMatch) continue;

    const dateStr = dateMatch[0];
    const lineWithoutDate = line.replace(dateMatch[0], "").trim();

    // Split remaining line by delimiters or spaces
    const parts = lineWithoutDate.split(/[,;\t|]+/).map(p => p.trim()).filter(Boolean);

    let amountVal: number | null = null;
    let description = "";
    let isIncome = false;

    // Search from parts for number and text
    for (const part of parts) {
      const num = parseCleanNumber(part);
      if (num !== null && num > 0 && amountVal === null) {
        amountVal = num;
        if (/credit|cr|deposit|income|refund/i.test(part)) {
          isIncome = true;
        }
      } else if (part.length >= 2 && !description && !/^\d+$/.test(part) && !/date|amount|debit|credit|balance|description/i.test(part)) {
        description = part;
      }
    }

    // Fallback if no parts matched
    if (amountVal === null) {
      const numbers = lineWithoutDate.match(/(?:[\$\₹\€\£]\s*)?[\+\-]?\d{1,7}(?:,\d{3})*(?:\.\d{1,2})?/g);
      if (numbers && numbers.length > 0) {
        for (let i = numbers.length - 1; i >= 0; i--) {
          const num = parseCleanNumber(numbers[i]);
          if (num !== null && num > 0) {
            amountVal = num;
            break;
          }
        }
      }
    }

    if (amountVal === null || amountVal === 0) continue;

    if (!description || description.length < 2) {
      description = lineWithoutDate.replace(/[\$\₹\€\£]?\s*[\+\-]?\d{1,7}(?:,\d{3})*(?:\.\d{1,2})?/g, "").trim() || "Bank Statement Item";
    }

    if (/credit|cr|deposit|payroll|refund|income/i.test(line)) {
      isIncome = true;
    }

    extracted.push({
      date: dateStr,
      amount: Math.abs(amountVal),
      description,
      type: isIncome ? "income" : "expense",
    });
  }

  return extracted;
}

/**
 * Strips preamble lines from CSV text so Papa.parse finds the true header row
 */
function findTableStart(text: string): string {
  const lines = text.split(/\r?\n/);
  let headerIndex = -1;

  for (let i = 0; i < Math.min(lines.length, 25); i++) {
    const line = lines[i].toLowerCase();
    // Check if line looks like a table header
    const hasDate = line.includes("date") || line.includes("dt") || line.includes("txn");
    const hasAmount = line.includes("amount") || line.includes("debit") || line.includes("credit") || line.includes("amt") || line.includes("val");
    const hasDesc = line.includes("desc") || line.includes("particular") || line.includes("narration") || line.includes("payee") || line.includes("detail") || line.includes("merchant");

    if ((hasDate && hasAmount) || (hasDate && hasDesc) || (hasAmount && hasDesc)) {
      headerIndex = i;
      break;
    }
  }

  if (headerIndex > 0) {
    return lines.slice(headerIndex).join("\n");
  }

  return text;
}

export async function POST(req: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    const contentType = req.headers.get("content-type") || "";

    // 1. If JSON payload: batch insert confirmed items
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { items } = body;

      if (!Array.isArray(items) || items.length === 0) {
        return errorResponse("No items provided for import", 400);
      }

      const formattedItems: StoredTransaction[] = items.map((item, idx) => ({
        id: item.id || `imp_${idx}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        userId,
        amount: Math.abs(parseFloat(item.amount)),
        date: item.date || new Date().toISOString().split("T")[0],
        description: item.description || item.merchant || "Imported Item",
        merchant: item.merchant || item.description || "Imported Item",
        categoryName: item.category || "General Expense",
        category: { name: item.category || "General Expense", type: item.type || "expense" },
        confidence: item.confidence || 0.95,
        isRecurring: !!item.isRecurring,
        type: item.type || "expense",
        createdAt: new Date().toISOString(),
      }));

      // 1. Save in resilient serverless transaction store
      saveTransactionsStore(userId, formattedItems);

      // 2. Save in Cloud Firestore in parallel without blocking batch response
      Promise.all(
        formattedItems.map((item) =>
          saveUserTransactionFirestore(userId, {
            amount: item.amount,
            date: item.date,
            description: item.description,
            merchant: item.merchant,
            category: item.categoryName,
            type: item.type,
            isRecurring: item.isRecurring,
          }).catch(() => null)
        )
      ).catch(() => null);

      // 3. Attempt Prisma insert as optional DB fallback
      try {
        // Ensure user exists in Prisma SQLite table to prevent P2003 Foreign key constraint violation
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

        const categories = await prisma.category.findMany();
        const categoryMap = new Map<string, string>();
        categories.forEach((c) => categoryMap.set(c.name, c.id));

        for (const item of formattedItems) {
          const catName = item.categoryName || "General Expense";
          let categoryId = categoryMap.get(catName);

          if (!categoryId) {
            try {
              const newCat = await prisma.category.create({
                data: { name: catName, type: item.type || "expense" },
              });
              categoryId = newCat.id;
              categoryMap.set(catName, categoryId);
            } catch (e) {
              // ignore category creation warning
            }
          }

          const dateObj = new Date(item.date);

          try {
            await prisma.transaction.create({
              data: {
                userId,
                amount: item.amount,
                date: isNaN(dateObj.getTime()) ? new Date() : dateObj,
                description: item.description,
                merchant: item.merchant || item.description,
                confidence: item.confidence || 0.95,
                isRecurring: !!item.isRecurring,
                categoryId: categoryId || null,
              },
            });
          } catch (tErr) {
            console.warn("[Prisma transaction insert warning]:", tErr);
          }
        }
      } catch (dbErr) {
        console.warn("[DB Batch Insert warning]:", dbErr);
      }

      return successResponse(
        { imported: formattedItems.length, items: formattedItems },
        `Successfully imported ${formattedItems.length} transactions`,
        201
      );
    }

    // 2. FormData file upload (preview mode or direct import)
    const { searchParams } = new URL(req.url);
    const isPreview = searchParams.get("preview") === "true";

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return errorResponse("No file uploaded", 400);
    }

    const isPdf = file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
    const previewList: Array<{
      id: string;
      date: string;
      description: string;
      merchant: string;
      category: string;
      confidence: number;
      amount: number;
      type: "expense" | "income";
      isRecurring: boolean;
      selected: boolean;
    }> = [];

    if (isPdf) {
      let pdfText = "";
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const pdfParse: any = await import("pdf-parse");
        const parseFn = pdfParse.default || pdfParse;
        const parsedPdf = await parseFn(buffer);
        pdfText = parsedPdf.text || "";
      } catch (err) {
        console.warn("PDF parse fallback:", err);
        pdfText = await file.text();
      }

      const rows = extractTransactionsFromText(pdfText);

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const dateObj = parseFlexibleDate(row.date);
        const catRes = await categorizeTransactionDetailed(row.description);
        const targetCat = row.type === "income" ? "Income" : catRes.category;

        previewList.push({
          id: `pdf_${i}_${Date.now()}`,
          date: dateObj.toISOString().split("T")[0],
          description: row.description,
          merchant: catRes.cleanMerchant || row.description,
          category: targetCat,
          confidence: catRes.confidence,
          amount: Math.abs(row.amount),
          type: row.type,
          isRecurring: catRes.isRecurring,
          selected: true,
        });
      }
    } else {
      // Intelligent Multi-Pass CSV Parsing
      let rawText = await file.text();
      rawText = rawText.replace(/^\uFEFF/, "").trim(); // Strip BOM

      // Find actual table start to strip bank metadata headers
      const cleanText = findTableStart(rawText);

      // Pass 1: Papa.parse headered
      let parseResult: any = await new Promise((res) => {
        Papa.parse(cleanText, {
          header: true,
          skipEmptyLines: "greedy",
          delimitersToGuess: [",", "\t", "|", ";"],
          transformHeader: (h) => h.trim().replace(/^['"]|['"]$/g, ""),
          complete: (results) => res(results),
        });
      });

      let rows = (parseResult.data || []) as any[];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!row || typeof row !== "object") continue;

        let cleanDesc = "";
        let dateVal: any = null;
        let amount = 0;
        let isIncome = false;

        // Extract description
        const descRaw =
          findRowValue(row, [
            "description", "narration", "particulars", "payee", "merchant",
            "details", "name", "memo", "remarks", "summary", "transaction",
            "title", "label", "narrative", "expense", "item", "vendor", "store",
            "company", "text", "line", "info", "note", "party", "txn", "ref"
          ]) || Object.values(row).find(v => typeof v === "string" && v.trim().length >= 2 && !v.match(/^\d{1,4}[\/\-\.]/));

        if (descRaw) cleanDesc = String(descRaw).trim();

        // Extract date
        dateVal = findRowValue(row, [
          "date", "dt", "txndate", "transactiondate", "postingdate", "valuedate", "timestamp", "time"
        ]) || Object.values(row).find(v => typeof v === "string" && (v.match(/\d{1,4}[\/\-\.]/) || v.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i)));

        // Extract amounts
        const debitVal = parseCleanNumber(findRowValue(row, ["debit", "withdrawal", "dr", "out", "paidout", "expense"]));
        const creditVal = parseCleanNumber(findRowValue(row, ["credit", "deposit", "cr", "in", "paidin", "income"]));
        const rawAmount = findRowValue(row, ["amount", "amt", "val", "value", "sum", "price", "total"]);
        const singleAmountVal = parseCleanNumber(rawAmount);

        if (creditVal !== null && creditVal > 0) {
          amount = creditVal;
          isIncome = true;
        } else if (debitVal !== null && debitVal > 0) {
          amount = debitVal;
          isIncome = false;
        } else if (singleAmountVal !== null && singleAmountVal !== 0) {
          const categoryCol = String(findRowValue(row, ["category", "cat", "type"]) || "").toLowerCase();
          if (categoryCol.includes("income") || categoryCol.includes("credit") || singleAmountVal < 0) {
            isIncome = singleAmountVal < 0 || categoryCol.includes("income");
            amount = Math.abs(singleAmountVal);
          } else {
            amount = Math.abs(singleAmountVal);
            isIncome = false;
          }
        }

        if (!cleanDesc || cleanDesc.length < 2 || amount === 0) continue;

        const dateObj = parseFlexibleDate(String(dateVal || ""));
        const catRes = await categorizeTransactionDetailed(cleanDesc);
        const targetCat = isIncome ? "Income" : (findRowValue(row, ["category", "cat"]) || catRes.category);

        previewList.push({
          id: `csv_${i}_${Date.now()}`,
          date: dateObj.toISOString().split("T")[0],
          description: cleanDesc,
          merchant: catRes.cleanMerchant || cleanDesc,
          category: targetCat,
          confidence: catRes.confidence,
          amount: Math.abs(amount),
          type: isIncome ? "income" : "expense",
          isRecurring: catRes.isRecurring,
          selected: true,
        });
      }

      // Pass 2: Fallback line-by-line parser if header parsing returned 0 valid items
      if (previewList.length === 0) {
        const lineRows = extractTransactionsFromText(rawText);
        for (let i = 0; i < lineRows.length; i++) {
          const row = lineRows[i];
          const dateObj = parseFlexibleDate(row.date);
          const catRes = await categorizeTransactionDetailed(row.description);
          const targetCat = row.type === "income" ? "Income" : catRes.category;

          previewList.push({
            id: `line_${i}_${Date.now()}`,
            date: dateObj.toISOString().split("T")[0],
            description: row.description,
            merchant: catRes.cleanMerchant || row.description,
            category: targetCat,
            confidence: catRes.confidence,
            amount: Math.abs(row.amount),
            type: row.type,
            isRecurring: catRes.isRecurring,
            selected: true,
          });
        }
      }
    }

    // Return preview payload or direct batch insert if not preview
    if (isPreview) {
      return successResponse(
        { preview: previewList, count: previewList.length },
        `Parsed ${previewList.length} transactions for review`
      );
    }

    // Direct import mode
    return successResponse(
      { imported: previewList.length },
      `Successfully parsed ${previewList.length} transactions`,
      201
    );
  } catch (error: any) {
    console.error("POST import error:", error);
    return errorResponse("Internal server error during import", 500);
  }
}
