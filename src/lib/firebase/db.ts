import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs,
  addDoc,
  DocumentData
} from "firebase/firestore";
import { db } from "./config";

// --- Timeout & Exception Guard for Unprovisioned Firestore Projects ---

const withTimeout = async <T>(promise: Promise<T>, timeoutMs = 1500, fallback: T): Promise<T> => {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => {
      resolve(fallback);
    }, timeoutMs);
  });

  try {
    const res = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timer!);
    return res;
  } catch (err: any) {
    clearTimeout(timer!);
    // Silence repetitive NOT_FOUND (Code 5) logs if Firestore DB is not yet created in Firebase Console
    if (err?.code === "not-found" || String(err).includes("NOT_FOUND") || err?.code === 5) {
      // Graceful fallback when Cloud Firestore DB instance isn't provisioned
    } else {
      console.warn("[Firestore Operation Warning]:", err?.message || err);
    }
    return fallback;
  }
};

// --- Generic CRUD Operations ---

export const createDocument = async (collectionName: string, docId: string, data: any): Promise<void> => {
  const docRef = doc(db, collectionName, docId);
  return withTimeout(setDoc(docRef, data, { merge: true }), 1500, undefined);
};

export const getDocument = async (collectionName: string, docId: string): Promise<DocumentData | null> => {
  const docRef = doc(db, collectionName, docId);
  return withTimeout(
    getDoc(docRef).then((snap) => (snap.exists() ? { id: snap.id, ...snap.data() } : null)),
    1500,
    null
  );
};

export const updateDocument = async (collectionName: string, docId: string, data: any): Promise<void> => {
  const docRef = doc(db, collectionName, docId);
  return withTimeout(updateDoc(docRef, data), 1500, undefined);
};

export const deleteDocument = async (collectionName: string, docId: string): Promise<void> => {
  const docRef = doc(db, collectionName, docId);
  return withTimeout(deleteDoc(docRef), 1500, undefined);
};

export const queryDocuments = async (
  collectionName: string, 
  fieldPath: string, 
  operator: any, 
  value: any
): Promise<DocumentData[]> => {
  const q = query(collection(db, collectionName), where(fieldPath, operator, value));
  return withTimeout(
    getDocs(q).then((snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    1500,
    []
  );
};

// --- Domain Specific Helpers ---

export const createUserProfile = async (userId: string, data: { email: string; name?: string; phone?: string; createdAt?: any }) => {
  return createDocument("users", userId, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
};

export const getUserProfile = async (userId: string) => {
  return getDocument("users", userId);
};

export const saveUserOnboardingData = async (userId: string, onboardingData: {
  currency?: string;
  monthlyIncome?: number | string;
  primaryGoal?: string;
  accounts?: any[];
  onboardedAt?: string;
}) => {
  return createDocument("users", userId, {
    onboarding: onboardingData,
    currency: onboardingData.currency || "$",
    monthlyIncome: onboardingData.monthlyIncome || null,
    updatedAt: new Date().toISOString(),
  });
};

export const saveUserTransactionFirestore = async (userId: string, transaction: {
  amount: number;
  date: string;
  description: string;
  merchant?: string;
  category?: string;
  type?: "expense" | "income";
  isRecurring?: boolean;
}) => {
  const userTxnsRef = collection(db, "users", userId, "transactions");
  return withTimeout(
    addDoc(userTxnsRef, {
      ...transaction,
      createdAt: new Date().toISOString(),
    }),
    1500,
    undefined as any
  );
};

export const getUserTransactionsFirestore = async (userId: string) => {
  const userTxnsRef = collection(db, "users", userId, "transactions");
  return withTimeout(
    getDocs(userTxnsRef).then((snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    1500,
    []
  );
};
