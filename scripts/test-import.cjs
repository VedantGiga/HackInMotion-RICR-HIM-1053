const Papa = require("papaparse");

const sampleCsv1 = `Date,Description,Amount
2026-02-10,Netflix Subscription,-15.99
2026-02-11,Starbucks Coffee,5.50
2026-02-12,Salary Deposit,-3500.00
2026-02-13,Uber Ride,24.50
`;

const sampleCsv2 = `Txn Date,Particulars,Debit,Credit
10/02/2026,Swiggy Food Order,450.00,
11/02/2026,Salary Credit,,75000.00
12/02/2026,Amazon Electronics,2499.00,
`;

const sampleCsv3 = `"Date","Transaction Details","Amount"
"14/02/2026","Apple Store Purchase","$148.50"
"15/02/2026","Gym Membership","$50.00"
`;

function parseCleanNumber(val) {
  if (val === null || val === undefined) return null;
  const str = String(val).replace(/[^0-9\.\-]/g, "").trim();
  if (!str) return null;
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
}

function parseCsv(text) {
  text = text.replace(/^\uFEFF/, "").trim();
  const parseResult = Papa.parse(text, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (h) => h.trim().replace(/^['"]|['"]$/g, ""),
  });

  console.log("Parsed Rows Count:", parseResult.data.length);
  console.log("Headers:", Object.keys(parseResult.data[0] || {}));
  console.log("Sample Row 0:", parseResult.data[0]);
}

console.log("--- TEST CSV 1 ---");
parseCsv(sampleCsv1);
console.log("--- TEST CSV 2 ---");
parseCsv(sampleCsv2);
console.log("--- TEST CSV 3 ---");
parseCsv(sampleCsv3);
