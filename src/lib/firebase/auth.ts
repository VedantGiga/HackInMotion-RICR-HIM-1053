import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  UserCredential,
  User
} from "firebase/auth";
import { auth } from "./config";

// --- Email / Password Authentication ---

export const signUp = async (email: string, password: string, name?: string): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (name && userCredential.user) {
      await updateProfile(userCredential.user, { displayName: name });
    }
    if (userCredential.user) {
      try {
        await sendEmailVerification(userCredential.user);
      } catch (e) {
        console.warn("[Firebase] Email verification dispatch error:", e);
      }
    }
    return userCredential;
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error));
  }
};

export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error));
  }
};

export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error));
  }
};

// --- OAuth / Third-Party Authentication ---

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    return userCredential;
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error));
  }
};

function getFirebaseErrorMessage(error: any): string {
  const code = error?.code || "";
  switch (code) {
    case "auth/invalid-email":
      return "Invalid email address format.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password. Please try again.";
    case "auth/email-already-in-use":
      return "An account already exists with this email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters long.";
    case "auth/too-many-requests":
      return "Access to this account has been temporarily disabled due to many failed login attempts. You can reset your password or try again later.";
    default:
      return error?.message || "An unexpected authentication error occurred.";
  }
}
