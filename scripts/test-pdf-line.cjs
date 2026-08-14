function parseCleanNumber(val) {
  if (val === null || val === undefined) return null;
  const str = String(val).replace(/[^0-9\.\-]/g, "").trim();
  if (!str) return null;
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
}

function parseLine(line) {
  const dateRegex = /(\d{1,4}[\/\-\.](?:[A-Za-z]{3,9}|\d{1,2})[\/\-\.]\d{1,4})/;
  const dateMatch = line.match(dateRegex);

  if (!dateMatch) return null;

  const dateStr = dateMatch[1];
  let lineWithoutDate = line.replace(dateMatch[0], "").trim();

  // Match amounts (numbers with decimal places or preceded by currency symbol)
  const amountRegex = /(?:[\$\₹\€\£]\s*[\+\-]?\d{1,6}(?:,\d{3})*(?:\.\d{2})?)|(?:[\+\-]?\d{1,6}(?:,\d{3})*\.\d{2})/g;
  const matches = lineWithoutDate.match(amountRegex);

  if (!matches || matches.length === 0) return null;

  const rawAmountStr = matches[matches.length - 1]; // Last match is transaction amount
  const amountVal = parseCleanNumber(rawAmountStr);

  let description = lineWithoutDate
    .replace(rawAmountStr, "")
    .replace(/[^a-zA-Z0-9\s\*&]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!description) description = "Bank Line Item";

  return { date: dateStr, amount: Math.abs(amountVal), description };
}

console.log(parseLine("10/02/2026 Starbucks Coffee $5.50"));
console.log(parseLine("2026-02-14 Apple Store Purchase -$148.50"));
console.log(parseLine("12-Jan-2026 Salary Credit ₹75,000.00"));
