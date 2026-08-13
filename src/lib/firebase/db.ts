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
  DocumentData
} from "firebase/firestore";
import { db } from "./config";

// --- Generic CRUD Operations ---

/**
 * Creates or overwrites a document in a specified collection.
 */
export const createDocument = async (collectionName: string, docId: string, data: any): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data);
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Fetches a single document by ID.
 */
export const getDocument = async (collectionName: string, docId: string): Promise<DocumentData | null> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching document from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Updates specific fields in an existing document.
 */
export const updateDocument = async (collectionName: string, docId: string, data: any): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Deletes a document.
 */
export const deleteDocument = async (collectionName: string, docId: string): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Queries a collection based on a simple where clause.
 */
export const queryDocuments = async (
  collectionName: string, 
  fieldPath: string, 
  operator: any, 
  value: any
): Promise<DocumentData[]> => {
  try {
    const q = query(collection(db, collectionName), where(fieldPath, operator, value));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error querying ${collectionName}:`, error);
    throw error;
  }
};

// --- Specific Domain Helpers ---

export const createUserProfile = async (userId: string, data: { email: string; name?: string; phone?: string; createdAt: Date }) => {
  return createDocument("users", userId, data);
};

export const getUserProfile = async (userId: string) => {
  return getDocument("users", userId);
};
