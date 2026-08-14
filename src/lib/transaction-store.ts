import fs from "fs";
import path from "path";

export interface StoredTransaction {
  id: string;
  userId: string;
  amount: number;
  date: string;
  description: string;
  merchant?: string;
  categoryName?: string;
  category?: { name: string; type?: string };
  confidence?: number;
  isRecurring?: boolean;
  type?: "expense" | "income";
  createdAt?: string;
}

const TX_FILE = "/tmp/koshin_transactions.json";

const globalForTx = globalThis as unknown as {
  _txStore?: Record<string, StoredTransaction[]>;
};

if (!globalForTx._txStore) {
  globalForTx._txStore = {};
}

function loadTxFromFile(): Record<string, StoredTransaction[]> {
  try {
    if (fs.existsSync(TX_FILE)) {
      const data = fs.readFileSync(TX_FILE, "utf-8");
      return JSON.parse(data) || {};
    }
  } catch (err) {
    console.warn("[TransactionStore] Failed to read file:", err);
  }
  return {};
}

function saveTxToFile(store: Record<string, StoredTransaction[]>) {
  try {
    const dir = path.dirname(TX_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(TX_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.warn("[TransactionStore] Failed to write file:", err);
  }
}

export function saveTransactionsStore(userId: string, transactions: StoredTransaction[]): StoredTransaction[] {
  if (!userId) return [];

  const store = globalForTx._txStore || {};
  const currentTxList = store[userId] || [];
  
  const existingIds = new Set(currentTxList.map(t => t.id));
  const newItems = transactions.filter(t => !existingIds.has(t.id));

  const updatedList = [...newItems, ...currentTxList];
  store[userId] = updatedList;
  globalForTx._txStore = store;

  const fileStore = loadTxFromFile();
  fileStore[userId] = updatedList;
  saveTxToFile(fileStore);

  return updatedList;
}

export function getTransactionsStore(userId: string): StoredTransaction[] {
  if (!userId) return [];

  if (globalForTx._txStore && globalForTx._txStore[userId] && globalForTx._txStore[userId].length > 0) {
    return globalForTx._txStore[userId];
  }

  const fileStore = loadTxFromFile();
  if (fileStore[userId]) {
    if (!globalForTx._txStore) globalForTx._txStore = {};
    globalForTx._txStore[userId] = fileStore[userId];
    return fileStore[userId];
  }

  return [];
}

export function deleteTransactionStore(userId: string, id?: string): void {
  if (!userId) return;

  const store = globalForTx._txStore || {};
  const fileStore = loadTxFromFile();

  if (!id) {
    // Clear all for user
    store[userId] = [];
    fileStore[userId] = [];
  } else {
    store[userId] = (store[userId] || []).filter(t => t.id !== id);
    fileStore[userId] = (fileStore[userId] || []).filter(t => t.id !== id);
  }

  globalForTx._txStore = store;
  saveTxToFile(fileStore);
}
