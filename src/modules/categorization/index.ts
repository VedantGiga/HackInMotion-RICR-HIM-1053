import { prisma } from "@/lib/prisma";

const CATEGORY_RULES = [
  { keywords: ["uber", "lyft", "transit", "train", "flight", "taxi"], category: "Travel" },
  { keywords: ["netflix", "spotify", "hulu", "amazon prime", "disney+"], category: "Subscriptions" },
  { keywords: ["mcdonalds", "starbucks", "doordash", "uber eats", "restaurant", "cafe"], category: "Food" },
  { keywords: ["walmart", "target", "amazon", "grocery", "whole foods", "kroger"], category: "Groceries" },
  { keywords: ["rent", "mortgage", "electric", "water", "internet", "utility"], category: "Housing & Bills" },
  { keywords: ["movie", "theater", "concert", "ticketmaster", "game"], category: "Entertainment" },
  { keywords: ["zara", "h&m", "nike", "adidas", "clothing", "apparel"], category: "Shopping" },
  { keywords: ["hospital", "pharmacy", "cvs", "walgreens", "doctor", "health"], category: "Health" },
];

export async function categorizeTransaction(description: string): Promise<string> {
  const lowerDesc = description.toLowerCase();

  for (const rule of CATEGORY_RULES) {
    for (const keyword of rule.keywords) {
      if (lowerDesc.includes(keyword)) {
        return rule.category;
      }
    }
  }
  
  return "Uncategorized"; // Default
}

export async function processUncategorizedTransactions(userId: string) {
  const uncategorizedTransactions = await prisma.transaction.findMany({
    where: {
      userId,
      categoryId: null, // Only process those without a category
    }
  });

  let processedCount = 0;

  // For caching categories
  const categoryMap = new Map<string, string>();
  const dbCategories = await prisma.category.findMany();
  for (const cat of dbCategories) {
    categoryMap.set(cat.name, cat.id);
  }

  for (const tx of uncategorizedTransactions) {
    const categoryName = await categorizeTransaction(tx.description);
    
    // Ensure category exists
    let categoryId = categoryMap.get(categoryName);
    if (!categoryId) {
      const newCategory = await prisma.category.create({
        data: { name: categoryName, type: "expense" }
      });
      categoryId = newCategory.id;
      categoryMap.set(categoryName, categoryId);
    }

    // Update transaction
    await prisma.transaction.update({
      where: { id: tx.id },
      data: { categoryId }
    });
    
    processedCount++;
  }

  return processedCount;
}
