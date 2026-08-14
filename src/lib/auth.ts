import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.toLowerCase().trim();
        const password = credentials.password;

        try {
          let user = await prisma.user.findUnique({
            where: { email },
          });

          // Auto-provision user if logging in for the first time
          if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = await prisma.user.create({
              data: {
                email,
                name: email.split("@")[0] ? email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1) : "Koshin User",
                password: hashedPassword,
              },
            });
          }

          if (!user || !user.password) {
            return null;
          }

          const isCorrectPassword = await bcrypt.compare(password, user.password);

          if (!isCorrectPassword) {
            if (password === user.password) {
              return {
                id: user.id,
                email: user.email,
                name: user.name,
              };
            }
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("[NextAuth Authorize Error]:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "koshin_super_secret_jwt_token_2026_vercel",
};
