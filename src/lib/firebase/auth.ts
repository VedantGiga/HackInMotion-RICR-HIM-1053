import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  UserCredential
} from "firebase/auth";
import { auth } from "./config";

// --- Email / Password Authentication ---

export const signUp = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw error;
  }
};

export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// --- OAuth / Third-Party Authentication ---

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    return userCredential;
  } catch (error) {
    throw error;
  }
};
