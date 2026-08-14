"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { signUp, signIn, logOut, signInWithGoogle } from "@/lib/firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: typeof signUp;
  signIn: typeof signIn;
  logOut: typeof logOut;
  signInWithGoogle: typeof signInWithGoogle;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp,
  signIn,
  logOut,
  signInWithGoogle,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, logOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * Backwards compatibility hook for NextAuth's useSession()
 */
export const useSession = () => {
  const { user, loading } = useAuth();
  const update = async (_data?: any) => {};
  
  if (loading) {
    return { data: null, status: "loading" as const, update };
  }

  if (!user) {
    return { data: null, status: "unauthenticated" as const, update };
  }

  return {
    data: {
      user: {
        id: user.uid,
        email: user.email,
        name: user.displayName || user.email?.split("@")[0] || "User",
        image: user.photoURL,
        emailVerified: user.emailVerified,
      },
    },
    status: "authenticated" as const,
    update,
  };
};
