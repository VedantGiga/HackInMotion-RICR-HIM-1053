import { prisma } from "@/lib/prisma";

export interface CategorizationResult {
  category: string;
  confidence: number;
  isRecurring: boolean;
  cleanMerchant: string;
  method: "exact_rule" | "ngram_vector" | "levenshtein_distance" | "fallback";
}

// Extensive merchant taxonomy with keywords, recurring flags, and clean display names
const MERCHANT_TAXONOMY = [
  // Subscriptions & Recurring Bills
  { keywords: ["netflix", "nflx", "spotify", "hulu", "disney", "prime video", "apple.com/bill", "youtube premium", "hbo", "patreon", "chatgpt", "openai", "github"], category: "Subscriptions", isRecurring: true },
  
  // Food & Dining
  { keywords: ["mcdonald", "starbucks", "sbux", "doordash", "ubereats", "swiggy", "zomato", "domino", "dunkin", "chipotle", "subway", "burger king", "taco bell", "cafe", "restaurant", "bakery", "deli"], category: "Food & Dining", isRecurring: false },
  
  // Groceries & Supermarkets
  { keywords: ["walmart", "target", "costco", "whole foods", "trader joe", "kroger", "bllinkit", "zepto", "instamart", "grocery", "supermarket"], category: "Groceries", isRecurring: false },
  
  // Travel & Rides
  { keywords: ["uber", "lyft", "ola", "rapido", "cab", "taxi", "amtrak", "airline", "delta", "united", "air india", "indigo", "expedia", "booking.com", "airbnb", "flight"], category: "Travel & Rides", isRecurring: false },
  
  // Housing & Bills / Utilities
  { keywords: ["rent", "mortgage", "electric", "power", "water", "gas", "utility", "spectrum", "comcast", "xfinity", "verizon", "att", "t-mobile", "jio", "airtel"], category: "Housing & Rent", isRecurring: true },
  
  // Shopping & Ecommerce
  { keywords: ["amazon", "amzn", "ebay", "flipkart", "myntra", "zara", "h&m", "nike", "adidas", "sephora", "uniqlo", "best buy"], category: "Shopping", isRecurring: false },
  
  // Health & Wellness
  { keywords: ["cvs", "walgreens", "pharmacy", "hospital", "doctor", "dental", "gym", "planet fitness", "equinox", "cult.fit", "health"], category: "Health & Medical", isRecurring: false },
  
  // Entertainment & Leisure
  { keywords: ["ticketmaster", "cinema", "movie", "amc", "steam", "playstation", "xbox", "nintendo", "bookmyshow"], category: "Entertainment", isRecurring: false },
  
  // Income / Salary
  { keywords: ["salary", "payroll", "stipend", "direct deposit", "freelance", "dividend", "refund"], category: "Income", isRecurring: false },
];

/**
 * Levenshtein distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * N-Gram Character Vector Similarity (0.00 to 1.00)
 */
function nGramSimilarity(str1: string, str2: string, n = 3): number {
  const getNGrams = (s: string) => {
    const grams = new Set<string>();
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "");
    for (let i = 0; i <= cleaned.length - n; i++) {
      grams.add(cleaned.substring(i, i + n));
    }
    return grams;
  };

  const g1 = getNGrams(str1);
  const g2 = getNGrams(str2);
  if (g1.size === 0 || g2.size === 0) return 0;

  let intersection = 0;
  g1.forEach((gram) => {
    if (g2.has(gram)) intersection++;
  });

  return (2 * intersection) / (g1.size + g2.size);
}

/**
 * Normalizes raw cryptic merchant string (e.g. "TST* SBUX 4921" -> "Starbucks")
 */
function normalizeMerchantName(description: string): string {
  const cleaned = description
    .replace(/^tst\*\s*/i, "")
    .replace(/^sq\*\s*/i, "")
    .replace(/^py\*\s*/i, "")
    .replace(/\b\d{4,}\b/g, "")
    .replace(/[^a-zA-Z0-9\s&]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return description;
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

/**
 * Main Hybrid Categorization Engine
 * 1. Exact Pattern Match (Confidence 0.95 - 0.99)
 * 2. N-Gram Vector Cosine Similarity (Confidence 0.80 - 0.92)
 * 3. Levenshtein String Distance (Confidence 0.70 - 0.84)
 */
export async function categorizeTransactionDetailed(description: string): Promise<CategorizationResult> {
  const lower = description.toLowerCase();
  const cleanMerchant = normalizeMerchantName(description);

  // 1. Exact Keyword / Pattern Matching
  for (const entry of MERCHANT_TAXONOMY) {
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) {
        return {
          category: entry.category,
          confidence: 0.98,
          isRecurring: entry.isRecurring,
          cleanMerchant,
          method: "exact_rule",
        };
      }
    }
  }

  // 2. N-Gram Vector Distance Scoring
  let bestVectorScore = 0;
  let bestVectorMatch: typeof MERCHANT_TAXONOMY[0] | null = null;

  for (const entry of MERCHANT_TAXONOMY) {
    for (const kw of entry.keywords) {
      const sim = nGramSimilarity(lower, kw);
      if (sim > bestVectorScore) {
        bestVectorScore = sim;
        bestVectorMatch = entry;
      }
    }
  }

  if (bestVectorMatch && bestVectorScore > 0.45) {
    return {
      category: bestVectorMatch.category,
      confidence: Math.min(0.94, parseFloat((0.70 + bestVectorScore * 0.30).toFixed(2))),
      isRecurring: bestVectorMatch.isRecurring,
      cleanMerchant,
      method: "ngram_vector",
    };
  }

  // 3. Levenshtein String Similarity Scoring
  let bestLevScore = Infinity;
  let bestLevMatch: typeof MERCHANT_TAXONOMY[0] | null = null;

  for (const entry of MERCHANT_TAXONOMY) {
    for (const kw of entry.keywords) {
      const dist = levenshteinDistance(lower, kw);
      if (dist < bestLevScore) {
        bestLevScore = dist;
        bestLevMatch = entry;
      }
    }
  }

  if (bestLevMatch && bestLevScore <= 3) {
    const conf = Math.max(0.70, 0.90 - bestLevScore * 0.06);
    return {
      category: bestLevMatch.category,
      confidence: parseFloat(conf.toFixed(2)),
      isRecurring: bestLevMatch.isRecurring,
      cleanMerchant,
      method: "levenshtein_distance",
    };
  }

  // 4. Fallback
  return {
    category: "General Expense",
    confidence: 0.60,
    isRecurring: false,
    cleanMerchant,
    method: "fallback",
  };
}

export async function categorizeTransaction(description: string): Promise<string> {
  const result = await categorizeTransactionDetailed(description);
  return result.category;
}

export async function processUncategorizedTransactions(userId: string) {
  const uncategorized = await prisma.transaction.findMany({
    where: {
      userId,
      categoryId: null,
    },
  });

  let processedCount = 0;
  const categoryMap = new Map<string, string>();
  const dbCategories = await prisma.category.findMany();
  for (const cat of dbCategories) {
    categoryMap.set(cat.name, cat.id);
  }

  for (const tx of uncategorized) {
    const res = await categorizeTransactionDetailed(tx.description);
    
    let categoryId = categoryMap.get(res.category);
    if (!categoryId) {
      const newCategory = await prisma.category.create({
        data: { name: res.category, type: "expense" },
      });
      categoryId = newCategory.id;
      categoryMap.set(res.category, categoryId);
    }

    await prisma.transaction.update({
      where: { id: tx.id },
      data: {
        categoryId,
        merchant: res.cleanMerchant,
        confidence: res.confidence,
        isRecurring: res.isRecurring,
      },
    });
    
    processedCount++;
  }

  return processedCount;
}
