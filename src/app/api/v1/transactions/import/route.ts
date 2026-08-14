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

  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) return parsed;

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
    const contentType = req.headers.get("content-type") || "";

    // 1. If JSON payload: batch insert confirmed items
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { items } = body;

      if (!Array.isArray(items) || items.length === 0) {
        return errorResponse("No items provided for import", 400);
      }

      const categories = await prisma.category.findMany();
      const categoryMap = new Map<string, string>();
      categories.forEach((c) => categoryMap.set(c.name, c.id));

      let insertedCount = 0;

      for (const item of items) {
        const catName = item.category || "General Expense";
        let categoryId = categoryMap.get(catName);

        if (!categoryId) {
          const newCat = await prisma.category.create({
            data: { name: catName, type: item.type || "expense" },
          });
          categoryId = newCat.id;
          categoryMap.set(catName, categoryId);
        }

        const dateObj = item.date ? new Date(item.date) : new Date();

        await prisma.transaction.create({
          data: {
            userId,
            amount: Math.abs(parseFloat(item.amount)),
            date: isNaN(dateObj.getTime()) ? new Date() : dateObj,
            description: item.description || item.merchant || "Imported Item",
            merchant: item.merchant || item.description || "Imported Item",
            confidence: item.confidence || 0.95,
            isRecurring: !!item.isRecurring,
            categoryId,
          },
        });

        insertedCount++;
      }

      return successResponse(
        { imported: insertedCount },
        `Successfully imported ${insertedCount} transactions`,
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

      const rows = extractTransactionsFromPdfText(pdfText);

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const dateObj = parseRobustDate(row.date);
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
          type: row.type || (row.amount < 0 ? "income" : "expense"),
          isRecurring: catRes.isRecurring,
          selected: true,
        });
      }
    } else {
      // CSV Parsing
      const text = await file.text();
      const parseResult: any = await new Promise((res) => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => res(results),
        });
      });

      const data = parseResult.data as any[];

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const description =
          findRowValue(row, [
            "description", "narration", "particulars", "payee", "merchant",
            "details", "name", "memo", "remarks", "summary", "transaction"
          ]) || Object.values(row).find(v => typeof v === "string" && v.length > 3 && !v.match(/^\d{1,4}[\/\-\.]/));

        if (!description || String(description).trim().length < 2) continue;
        const cleanDesc = String(description).trim();

        const dateVal = findRowValue(row, [
          "date", "dt", "txndate", "transactiondate", "postingdate", "valuedate", "timestamp", "time"
        ]) || Object.values(row).find(v => typeof v === "string" && v.match(/\d{1,4}[\/\-\.]/));

        const dateObj = parseRobustDate(String(dateVal || ""));

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
        } else continue;

        if (amount === 0) continue;

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
    }

    // Return preview payload or direct batch insert if not preview
    if (isPreview) {
      return successResponse(
        { preview: previewList, count: previewList.length },
        `Parsed ${previewList.length} transactions for review`
      );
    }

    // If not preview mode, proceed to batch insert directly
    const categories = await prisma.category.findMany();
    const categoryMap = new Map<string, string>();
    categories.forEach((c) => categoryMap.set(c.name, c.id));

    let importedCount = 0;

    for (const item of previewList) {
      let categoryId = categoryMap.get(item.category);
      if (!categoryId) {
        const newCat = await prisma.category.create({
          data: { name: item.category, type: item.type },
        });
        categoryId = newCat.id;
        categoryMap.set(item.category, categoryId);
      }

      await prisma.transaction.create({
        data: {
          userId,
          amount: item.amount,
          date: new Date(item.date),
          description: item.description,
          merchant: item.merchant,
          confidence: item.confidence,
          isRecurring: item.isRecurring,
          categoryId,
        },
      });
      importedCount++;
    }

    return successResponse(
      { imported: importedCount },
      `Successfully imported ${importedCount} transactions`,
      201
    );
  } catch (error: any) {
    console.error("POST import error:", error);
    return errorResponse("Internal server error", 500);
  }
}
